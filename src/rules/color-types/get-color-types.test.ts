import * as postCss from 'postcss';
import * as postLess from 'postcss-less';
import {ColorType, getColorTypes} from './get-color-types';

enum Lang {
    css = 'css',
    less = 'less',
}

testCode('color: purple', [ColorType.named], Lang.css);
testCode('color: rgb(0, 0, 0)', [ColorType.rgb], Lang.css);
testCode('color: #000000', [ColorType.hex], Lang.css);
testCode(
    '.styles {color: rgb(0, 0, 0); background-color: hsva(0, 0, 0, 0);}',
    [ColorType.rgb, ColorType.hsva],
    Lang.css,
);
testCode(
    '.styles {color: rgb(0, 0, 0); background-color: #000000;}',
    [ColorType.rgb, ColorType.hex],
    Lang.css,
);
testCode(
    '.styles {color: blue; background-color: #000000;}',
    [ColorType.named, ColorType.hex],
    Lang.css,
);
testCode('.styles {color: invalid-color; background-color: #000000;}', [ColorType.hex], Lang.css);
testCode(
    `
    .myMixin(@colorVal) {
        color: @colorVal;
    }

    div {
        .myMixin(#123);
    }`,
    [ColorType.hex],
    Lang.less,
);

function testCode(code: string, types: ColorType[], language: Lang) {
    test(code, () => {
        const parsedTypes = new Set<ColorType>();

        const parser = getParser(language);

        parser.parse(code).walkDecls((declaration) => {
            getColorTypes(declaration).forEach((parsedType) => parsedTypes.add(parsedType));
        });

        parser.parse(code).walkAtRules((atRule) => {
            getColorTypes(atRule).forEach((parsedType) => parsedTypes.add(parsedType));
        });

        expect(JSON.stringify(Array.from(parsedTypes).sort())).toBe(JSON.stringify(types.sort()));
    });
}

function getParser(language: Lang) {
    switch (language) {
        case Lang.less:
            return postLess;
        case Lang.css:
            return postCss;
    }
}
