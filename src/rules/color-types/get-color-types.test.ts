import * as postCss from 'postcss';
import * as postLess from 'postcss-less';
import {Syntax} from '../../syntax';
import {ColorType, getColorTypes} from './get-color-types';

testCode('color: purple', [ColorType.named], Syntax.css);
testCode('color: rgb(0, 0, 0)', [ColorType.rgb], Syntax.css);
testCode('color: #000000', [ColorType.hex], Syntax.css);
testCode(
    '.styles {color: rgb(0, 0, 0); background-color: hsva(0, 0, 0, 0);}',
    [
        ColorType.rgb,
        ColorType.hsva,
    ],
    Syntax.css,
);
testCode(
    '.styles {color: rgb(0, 0, 0); background-color: #000000;}',
    [
        ColorType.rgb,
        ColorType.hex,
    ],
    Syntax.css,
);
testCode(
    '.styles {color: blue; background-color: #000000;}',
    [
        ColorType.named,
        ColorType.hex,
    ],
    Syntax.css,
);
testCode('.styles {color: invalid-color; background-color: #000000;}', [ColorType.hex], Syntax.css);
testCode(
    `
    .myMixin(@colorVal) {
        color: @colorVal;
    }

    div {
        .myMixin(#123);
    }`,
    [ColorType.hex],
    Syntax.less,
);
testCode(
    `
    div {
        color: darken(#123, 50%);
    }`,
    [ColorType.hex],
    Syntax.less,
);
// no false positives
testCode(
    `
    :host(#cab) {
        text-align: center;
    }`,
    [],
    Syntax.css,
);
testCode(
    `
    :host {
        #cab {
            text-align: center;
        }
    }`,
    [],
    Syntax.less,
);
testCode(
    `
    :host {
        #cab {
            cursor: default;
        }
    }`,
    [],
    Syntax.less,
);
testCode(
    `
    $thing: blue;

    :host {
        #cab {
            cursor: default;
            color: $thing;
        }
    }`,
    [ColorType.named],
    Syntax.scss,
);

function testCode(code: string, types: ColorType[], language: Syntax) {
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

function getParser(language: Syntax) {
    switch (language) {
        case Syntax.less:
            return postLess;
        case Syntax.css:
            return postCss;
        case Syntax.scss:
            // not sure what this should be actually
            return postLess;
    }
}
