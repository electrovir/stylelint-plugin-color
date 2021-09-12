import * as colorNamesObject from 'css-color-names';
import {AtRule, Declaration} from 'postcss';
import {MixinAtRule as LessMixinAtRule, VariableAtRule as LessVarAtRule} from 'postcss-less';
import parseValue, {Node as ValueNode} from 'postcss-value-parser';
import styleSearch from 'style-search';

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

export type ColorTypesNode = Declaration | AtRule | LessVarAtRule | LessMixinAtRule;

const colorNames = Object.keys(colorNamesObject);

const colorFunctions: ColorType[] = [
    ColorType.rgb,
    ColorType.rgba,
    ColorType.hsl,
    ColorType.hsla,
    ColorType.hsv,
    ColorType.hsva,
    ColorType.argb,
];

function getColorFunctionName(node: ValueNode): ColorType | undefined {
    return colorFunctions[colorFunctions.indexOf(node.value as ColorType)];
}

export function getColorTypes(node: ColorTypesNode): Set<ColorType> {
    const nodeString = node.toString();
    const nodeValue = (node as Declaration).value || (node as AtRule).params;
    const colorTypes = new Set<ColorType>();

    parseValue(nodeValue).walk((node) => {
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
    styleSearch({source: nodeString, target: '#'}, (match) => {
        // this is how the stylelint rule color-no-hex reads hex values
        const preHexLetter = nodeString[match.startIndex - 1];
        if (hexFound) {
            return;
        } else if (!preHexLetter) {
            return;
        } else if ('mixin' in node && node.mixin && preHexLetter === '(') {
            // don't return
        } else if (preHexLetter.match(/[:,\s]/)) {
            // don't return
        } else {
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
