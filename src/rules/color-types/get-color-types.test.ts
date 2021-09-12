import * as postCss from 'postcss';
import {ColorType, getColorTypes} from './get-color-types';

testCssCode('color: purple', [ColorType.named]);
testCssCode('color: rgb(0, 0, 0)', [ColorType.rgb]);
testCssCode('color: #000000', [ColorType.hex]);
testCssCode('.styles {color: rgb(0, 0, 0); background-color: hsva(0, 0, 0, 0);}', [
    ColorType.rgb,
    ColorType.hsva,
]);
testCssCode('.styles {color: rgb(0, 0, 0); background-color: #000000;}', [
    ColorType.rgb,
    ColorType.hex,
]);
testCssCode('.styles {color: blue; background-color: #000000;}', [ColorType.named, ColorType.hex]);
testCssCode('.styles {color: invalid-color; background-color: #000000;}', [ColorType.hex]);

function testCssCode(cssInput: string, types: ColorType[]) {
    test(cssInput, () => {
        const parsedTypes = new Set<ColorType>();

        postCss.parse(cssInput).walkDecls((declaration) => {
            getColorTypes(declaration).forEach((parsedType) => parsedTypes.add(parsedType));
        });

        expect(JSON.stringify(Array.from(parsedTypes).sort())).toBe(JSON.stringify(types.sort()));
    });
}
