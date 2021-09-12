import {Node, parse, Root} from 'postcss';
import {VariableAtRule} from 'postcss-less';
import {
    createDefaultRule,
    DefaultOptionMode,
    DefaultRuleOptions,
    doesMatchLineExceptions,
    ExceptionRegExps,
    ReportCallback,
} from 'stylelint-rule-creator';
import {prefix} from '../../plugin-util';
import {ColorType, ColorTypesNode, getColorTypes} from './get-color-types';

function colorTypeArrayToString(colorTypes: ColorType[]): string {
    return `[${colorTypes.join(', ')}]`;
}

const messages = {
    noColorTypesRequiredButColorTypesWereUsed(colorTypes: ColorType[]) {
        return `Color types not allowed because no required types were given: ${colorTypeArrayToString(
            colorTypes,
        )}`;
    },
    includesBlockedColorTypes(line: string, colorTypes: ColorType[]) {
        return `Color definitions of type ${colorTypeArrayToString(
            colorTypes,
        )} are blocked: "${line}"`;
    },
};

export type ColorTypesRuleOptions = DefaultRuleOptions & {
    types: ColorType[];
    blockHelperFunctions?: boolean;
};

const defaultOptions: ColorTypesRuleOptions = {
    mode: DefaultOptionMode.BLOCK,
    types: [
        ColorType.hex,
        ColorType.named,
        ColorType.rgb,
        ColorType.rgba,
        ColorType.hsl,
        ColorType.hsla,
        ColorType.hsv,
        ColorType.hsva,
        ColorType.argb,
    ],
    blockHelperFunctions: false,
};

// mode require: all color definitions must be in the given types list
// mode block: no color definitions can be in the given types list

function checkNodeBase({
    node,
    exceptionRegExps,
    baseReport,
    ruleMessages,
    ruleOptions,
}: {
    node: ColorTypesNode;
    exceptionRegExps: ExceptionRegExps;
    baseReport: ReportCallback;
    ruleMessages: typeof messages;
    ruleOptions: Partial<ColorTypesRuleOptions> & DefaultRuleOptions;
}) {
    if (doesMatchLineExceptions(node as Node, exceptionRegExps)) {
        return;
    }
    const colorTypes = Array.from(getColorTypes(node));

    if (!colorTypes.length) {
        // nothing to check if there are no color types in the current declaration
        return;
    }

    const report = (message: string) =>
        baseReport({
            message,
            node: node as Node,
            word: node.toString(),
        });

    if (ruleOptions.mode === DefaultOptionMode.REQUIRE) {
        const requiredTypes = ruleOptions.types;
        if (!requiredTypes?.length) {
            // short circuit if no required types were given but a color was defined
            report(ruleMessages.noColorTypesRequiredButColorTypesWereUsed(colorTypes));
            return;
        }

        const illegalColorTypes = colorTypes.filter((colorType) => {
            return !requiredTypes.includes(colorType);
        });

        if (illegalColorTypes.length) {
            report(ruleMessages.includesBlockedColorTypes(node.toString(), illegalColorTypes));
            return;
        }
    } else if (ruleOptions.mode === DefaultOptionMode.BLOCK) {
        const blockedTypes = ruleOptions.types;
        if (!blockedTypes?.length) {
            // no need to check if nothing is blocked
            return;
        }

        const illegalColorTypes = colorTypes.filter((colorType) => {
            return blockedTypes.includes(colorType);
        });
        if (illegalColorTypes.length) {
            report(ruleMessages.includesBlockedColorTypes(node.toString(), illegalColorTypes));
            return;
        }
    }
}

export const colorTypesRule = createDefaultRule<typeof messages, ColorTypesRuleOptions>({
    ruleName: `${prefix}/color-types`,
    messages,
    defaultOptions,
    ruleCallback: (baseReport, messages, {ruleOptions, root, exceptionRegExps}) => {
        function checkNode(node: ColorTypesNode) {
            checkNodeBase({
                node,
                exceptionRegExps,
                baseReport,
                ruleMessages: messages,
                ruleOptions,
            });
        }

        function checkAtRule(atRule: ColorTypesNode) {
            // only relevant for less syntax
            if (
                ('variable' in atRule && atRule.variable) ||
                // when mixins are called in less, like .myMixin(), they are turned into at rules
                ('mixin' in atRule && atRule.mixin)
            ) {
                checkNode(atRule);
            }
        }

        // this catches less mixin definitions
        root.walkRules((rule) => {
            if (rule.selector.includes('@') && rule.selector.includes('(')) {
                // extract out the mixin arguments
                const mixinArgs = rule.selector
                    .match(/\((?:\s*(.+?)\s*,\s*)*\s*(.+?)\s*\)/)
                    ?.slice(1);
                if (mixinArgs) {
                    mixinArgs.forEach((mixinArgString) => {
                        if (mixinArgString) {
                            // recombine the mixin arguments as declarations
                            let mixinArgsAsRootNode: undefined | Root;
                            try {
                                mixinArgsAsRootNode = parse(mixinArgString);
                            } catch (error) {
                                // ignore errors parsing
                            }
                            if (mixinArgsAsRootNode) {
                                mixinArgsAsRootNode.walkAtRules((atRule) => {
                                    // we know at this point tha this at rule is indeed a variable
                                    (atRule as VariableAtRule).variable = true;
                                    checkAtRule(atRule);
                                });
                            }
                        }
                    });
                }
            }
        });

        // this catches less variable assignments
        root.walkAtRules((atRule) => {
            checkAtRule(atRule);
        });

        // this catches normal style declarations
        root.walkDecls((declaration) => {
            checkNode(declaration);
        });
    },
});
