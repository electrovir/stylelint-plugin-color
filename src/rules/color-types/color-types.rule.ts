import {prefix} from '../../plugin-util';
import {
    createDefaultRule,
    DefaultOptionMode,
    DefaultRuleOptions,
    doesMatchLineExceptions,
    ExceptionRegExps,
    ReportCallback,
} from 'stylelint-rule-creator';
import * as parseValue from 'postcss-value-parser';
import * as styleSearch from 'style-search';
import {Node} from 'postcss-value-parser';
import {AtRule, Declaration, parse} from 'postcss';
import * as colorObject from 'css-color-names';

const colorNames = Object.keys(colorObject);

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

export enum ColorType {
    hex = 'hex',
    named = 'named',
    rgb = 'rgb',
    rgba = 'rgba',
    hsl = 'hsl',
    hsla = 'hsla',
    hsv = 'hsv',
    hsva = 'hsva',
    argb = 'argb',
}

const colorFunctions: ColorType[] = [
    ColorType.rgb,
    ColorType.rgba,
    ColorType.hsl,
    ColorType.hsla,
    ColorType.hsv,
    ColorType.hsva,
    ColorType.argb,
];

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

function getColorFunctionName(node: Node): ColorType | undefined {
    return colorFunctions[colorFunctions.indexOf(node.value as ColorType)];
}

export function getColorTypes(node: Declaration | AtRule): Set<ColorType> {
    const nodeString = node.toString();
    const nodeValue = (node as Declaration).value || (node as AtRule).params;
    const colorTypes = new Set<ColorType>();

    parseValue(nodeValue).walk(node => {
        // check for color functions
        if (node.type === 'function') {
            const colorFunctionName = getColorFunctionName(node);
            if (colorFunctionName) {
                colorTypes.add(colorFunctionName);
            }
        }

        // check for color keywords
        if (node.type === 'word') {
            if (colorNames.includes(node.value)) {
                colorTypes.add(ColorType.named);
            }
        }
    });

    let hexFound = false;

    // check for color hex values
    styleSearch({source: nodeString, target: '#'}, match => {
        // this is how the stylelint rule color-no-hex reads hex values
        if (!/[:,\s]/.test(nodeString[match.startIndex - 1]) || hexFound) {
            return;
        }

        const hexMatch = /^#[0-9A-Za-z]+/.exec(nodeString.substr(match.startIndex));

        if (hexMatch) {
            colorTypes.add(ColorType.hex);
            hexFound = true;
            return;
        }
    });

    return colorTypes;
}

// mode require: all color definitions must be in the given types list
// mode block: no color definitions can be in the given types list

function checkNodeBase({
    node,
    exceptionRegExps,
    baseReport,
    ruleMessages,
    ruleOptions,
}: {
    node: Declaration | AtRule;
    exceptionRegExps: ExceptionRegExps;
    baseReport: ReportCallback;
    ruleMessages: typeof messages;
    ruleOptions: Partial<ColorTypesRuleOptions> & DefaultRuleOptions;
}) {
    if (doesMatchLineExceptions(node, exceptionRegExps)) {
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
            node: node,
            word: node.toString(),
        });

    if (ruleOptions.mode === DefaultOptionMode.REQUIRE) {
        const requiredTypes = ruleOptions.types;
        if (!requiredTypes?.length) {
            // short circuit if no required types were given but a color was defined
            report(ruleMessages.noColorTypesRequiredButColorTypesWereUsed(colorTypes));
            return;
        }

        const illegalColorTypes = colorTypes.filter(colorType => {
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

        const illegalColorTypes = colorTypes.filter(colorType => {
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
        function checkNode(node: Declaration | AtRule) {
            checkNodeBase({
                node,
                exceptionRegExps,
                baseReport,
                ruleMessages: messages,
                ruleOptions,
            });
        }

        function checkAtRule(atRule: AtRule) {
            console.log(atRule.name);
            // atRule.`
            if (atRule.name.endsWith(':')) {
                checkNode(atRule);
            }
        }

        // this catches less mixin definitions
        root.walkRules(rule => {
            if (rule.selector.includes('@') && rule.selector.includes('(')) {
                // extract out the mixin arguments
                const mixinArgs = rule.selector
                    .match(/\((?:\s*(.+?)\s*,\s*)*\s*(.+?)\s*\)/)
                    ?.slice(1);
                if (mixinArgs) {
                    mixinArgs.forEach(mixinArgString => {
                        if (mixinArgString) {
                            // recombine the mixin arguments as declarations
                            const mixinArgsAsRootNode = parse(mixinArgString);
                            mixinArgsAsRootNode.walkAtRules(atRule => {
                                checkAtRule(atRule);
                            });
                        }
                    });
                }
            }
        });

        // this catches less variable assignments
        root.walkAtRules(atRule => checkAtRule(atRule));

        // this catches normal style declarations
        root.walkDecls(declaration => checkNode(declaration));
    },
});
