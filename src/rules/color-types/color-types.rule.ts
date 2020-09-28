import {prefix} from '../../plugin-util';
import {
    createDefaultRule,
    DefaultOptionMode,
    DefaultRuleOptions,
    doesMatchLineExceptions,
} from 'stylelint-rule-creator';
import * as parseValue from 'postcss-value-parser';
import * as styleSearch from 'style-search';
import {Node} from 'postcss-value-parser';
import {Declaration} from 'postcss';
import {parse, lexer, Declaration as DeclarationNode, Matched} from '../../css-tree';
import * as colorNames from 'css-color-names';

const messages = {
    invalidColorDefinition(colorDefinition: string) {
        return `Blocked color definition: ${colorDefinition}`;
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
    allowHelperFunctions: boolean;
};

const defaultOptions: ColorTypesRuleOptions = {
    mode: DefaultOptionMode.BLOCK,
    types: [],
    allowHelperFunctions: true,
};

function getColorFunctionName(node: Node): ColorType | undefined {
    return colorFunctions[colorFunctions.indexOf(node.value as ColorType)];
}

export function getColorTypes(declaration: Declaration): ColorType[] {
    const declarationString = declaration.toString();
    const colorTypes: ColorType[] = [];

    parseValue(declaration.value).walk(node => {
        // functions
        if (node.type === 'function') {
            const colorFunctionName = getColorFunctionName(node);
            if (colorFunctionName) {
                colorTypes.push(colorFunctionName);
            }
        }

        // keywords
        if (node.type === 'word') {
            if (Object.keys(colorNames).includes(node.value)) {
                colorTypes.push(ColorType.named);
            }
        }
    });

    // this is how the stylelint rule color-no-hex reads hex values
    styleSearch({source: declarationString, target: '#'}, match => {
        if (!/[:,\s]/.test(declarationString[match.startIndex - 1])) {
            return;
        }

        const hexMatch = /^#[0-9A-Za-z]+/.exec(declarationString.substr(match.startIndex));

        if (hexMatch) {
            colorTypes.push(ColorType.hex);
        }
    });

    return colorTypes;
}

// mode require: definition must be one of the given types
// mode block: definition cannot be any of the given types

export const colorTypesRule = createDefaultRule<typeof messages, ColorTypesRuleOptions>({
    ruleName: `${prefix}/color-types`,
    messages,
    defaultOptions,
    ruleCallback: (report, messages, {ruleOptions, root, context, exceptionRegExps}) => {
        root.walkDecls(declaration => {
            if (doesMatchLineExceptions(declaration, exceptionRegExps)) {
                return;
            }
            const colorTypes = getColorTypes(declaration);

            if (ruleOptions.mode === DefaultOptionMode.REQUIRE) {
                // TODO: report on require
                // report({
                //     message: messages.invalidColorDefinition(atRule.toString()),
                //     node: atRule,
                //     word: atRule.toString(),
                // });
            } else if (ruleOptions.mode === DefaultOptionMode.BLOCK) {
                // TODO: report on block
                // report({
                //     message: messages.invalidColorDefinition(atRule.toString()),
                //     node: atRule,
                //     word: atRule.toString(),
                // });
            }
        });
    },
});
