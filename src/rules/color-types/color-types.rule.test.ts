import {LinterOptions} from 'stylelint';
import {DefaultOptionMode} from 'stylelint-rule-creator';
import {
    DefaultRuleTest,
    RejectTestCase,
    TestCase,
    testDefaultRule,
} from 'stylelint-rule-creator/dist/testing';
import {pluginPath} from '../../plugin-util';
import {Syntax} from '../../syntax';
import {colorTypesRule, ColorTypesRuleOptions} from './color-types.rule';
import {ColorType} from './get-color-types';

function getObjectTypedKeys<T extends object>(input: T): (keyof T)[] {
    return Object.keys(input) as (keyof T)[];
}

function getEnumTypedKeys<T extends object>(input: T): (keyof T)[] {
    // keys are always strings
    return getObjectTypedKeys(input).filter((key) => isNaN(Number(key))) as (keyof T)[];
}

function getEnumTypedValues<T extends object>(input: T): T[keyof T][] {
    const keys = getEnumTypedKeys(input);
    return keys.map((key) => input[key]);
}

type AcceptSyntaxTest = TestCase & {
    // when no color type is provided, the test is expected to always pass, so no failure code is needed
    failureCode?: undefined;
    colorTypes: never[];
};
type RejectSyntaxTest = TestCase & {failureCode: string; colorTypes: ColorType[]};
type SyntaxTest = RejectSyntaxTest | AcceptSyntaxTest;

const testsBySyntax: {[key in Syntax]: SyntaxTest[]} = {
    [Syntax.less]: [
        {
            description: 'allow less variable usage',
            code: 'div { color: @myVar; }',
            colorTypes: [],
        },
        {
            description: 'keyword color in mixin definition',
            code: '.mixin-definition(@my-color: blue) {}',
            failureCode: '@my-color: blue',
            colorTypes: [ColorType.named],
        },
        {
            description: 'keyword in long mixin definition',
            code: '.mixin-name(@varA: @my-color-A, @varB: @my-color-B, @varC: @white, @varD: white) {}',
            failureCode: '@varD: white',
            colorTypes: [ColorType.named],
        },
        {
            description: 'allow less variable reassignment',
            code: '@myVar: @otherVar;',
            colorTypes: [],
        },
        {
            description: 'assigning hex colors to less variables',
            code: '@myVar: #000000;',
            failureCode: '@myVar: #000000',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'assigning keyword colors to less variables',
            code: '@myVar: blue;',
            failureCode: '@myVar: blue',
            colorTypes: [ColorType.named],
        },
        {
            // this was broken at one point
            description: "mixin syntax isn't broken",
            code: `
                .myMixin() {
                    font-family: serif;
                }
                
                div {
                    .myMixin();
                    color: #123;
                }`,
            failureCode: 'color: #123',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'catch hex values in first mixin argument',
            code: `
                .myMixin(@colorVal) {
                    color: @colorVal;
                }
                
                div {
                    .myMixin(#123);
                }`,
            // less parser turns the mixin call, .myMixin(), into an at rule, @myMixin().
            failureCode: '@myMixin(#123)',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'catch hex values in first mixin argument',
            code: `
                .myMixin(@colorVal, @colorVal2) {
                    color: @colorVal;
                    background-color: @colorVal2;
                }
                
                div {
                    .myMixin(#123, #123456);
                }`,
            // less parser turns the mixin call, .myMixin(), into an at rule, @myMixin().
            failureCode: '@myMixin(#123, #123456)',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'catch hex values in first mixin argument',
            code: `
                .myMixin(@colorVal, @colorVal2) {
                    color: @colorVal;
                    background-color: @colorVal2;
                }
                
                div {
                    .myMixin(blue, rgb(255, 0, 200));
                }`,
            // less parser turns the mixin call, .myMixin(), into an at rule, @myMixin().
            failureCode: '@myMixin(blue, rgb(255, 0, 200))',
            colorTypes: [
                ColorType.named,
                ColorType.rgb,
            ],
        },
        {
            description: 'assigning rgb colors to less variables',
            code: '@myVar: rgb(0, 0, 0);',
            failureCode: '@myVar: rgb(0, 0, 0)',
            colorTypes: [ColorType.rgb],
        },
        {
            description: 'assigning rgba colors to less variables',
            code: '@myVar: rgba(0, 0, 0, 0);',
            failureCode: '@myVar: rgba(0, 0, 0, 0)',
            colorTypes: [ColorType.rgba],
        },
        {
            description: 'assigning hsl colors to less variables',
            code: '@myVar: hsl(0, 0%, 0%);',
            failureCode: '@myVar: hsl(0, 0%, 0%)',
            colorTypes: [ColorType.hsl],
        },
        {
            description: 'assigning hsla colors to less variables',
            code: '@myVar: hsla(0, 0%, 0%, 0);',
            failureCode: '@myVar: hsla(0, 0%, 0%, 0)',
            colorTypes: [ColorType.hsla],
        },
        {
            description: 'assigning hsv colors to less variables',
            code: '@myVar: hsv(0, 0%, 0%);',
            failureCode: '@myVar: hsv(0, 0%, 0%)',
            colorTypes: [ColorType.hsv],
        },
        {
            description: 'assigning hsva colors to less variables',
            code: '@myVar: hsva(0, 0%, 0%, 0);',
            failureCode: '@myVar: hsva(0, 0%, 0%, 0)',
            colorTypes: [ColorType.hsva],
        },
        {
            description: 'assigning argb colors to less variables with hex input',
            code: '@myVar: argb(#000000);',
            failureCode: '@myVar: argb(#000000)',
            colorTypes: [
                ColorType.argb,
                ColorType.hex,
            ],
        },
        {
            description: 'assigning argb colors to less variables with rgb input',
            code: '@myVar: argb(rgb(4, 5, 6));',
            failureCode: '@myVar: argb(rgb(4, 5, 6))',
            colorTypes: [
                ColorType.argb,
                ColorType.rgb,
            ],
        },
    ],
    [Syntax.scss]: [
        {
            description: 'allow SCSS variable usage',
            code: 'div { color: $myVar; }',
            colorTypes: [],
        },
        {
            description: 'allow SCSS variable reassignment',
            code: '$myVar: $otherVar',
            colorTypes: [],
        },
        {
            description: 'assigning hex colors to scss variables',
            code: '$myVar: #000000;',
            failureCode: '$myVar: #000000',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'assigning keyword colors to scss variables',
            code: '$myVar: blue;',
            failureCode: '$myVar: blue',
            colorTypes: [ColorType.named],
        },
        {
            description: 'assigning rgb colors to scss variables',
            code: '$myVar: rgb(0, 0, 0);',
            failureCode: '$myVar: rgb(0, 0, 0)',
            colorTypes: [ColorType.rgb],
        },
        {
            description: 'assigning rgba colors to scss variables',
            code: '$myVar: rgba(0, 0, 0, 0);',
            failureCode: '$myVar: rgba(0, 0, 0, 0)',
            colorTypes: [ColorType.rgba],
        },
        {
            description: 'assigning hsl colors to scss variables',
            code: '$myVar: hsl(0, 0%, 0%);',
            failureCode: '$myVar: hsl(0, 0%, 0%)',
            colorTypes: [ColorType.hsl],
        },
        {
            description: 'assigning hsla colors to scss variables',
            code: '$myVar: hsla(0, 0%, 0%, 0);',
            failureCode: '$myVar: hsla(0, 0%, 0%, 0)',
            colorTypes: [ColorType.hsla],
        },
        {
            description: 'assigning hsv colors to scss variables',
            code: '$myVar: hsv(0, 0%, 0%);',
            failureCode: '$myVar: hsv(0, 0%, 0%)',
            colorTypes: [ColorType.hsv],
        },
        {
            description: 'assigning hsva colors to scss variables',
            code: '$myVar: hsva(0, 0%, 0%, 0);',
            failureCode: '$myVar: hsva(0, 0%, 0%, 0)',
            colorTypes: [ColorType.hsva],
        },
        {
            description: 'assigning argb colors to scss variables with hex input',
            code: '$myVar: argb(#000000);',
            failureCode: '$myVar: argb(#000000)',
            colorTypes: [
                ColorType.argb,
                ColorType.hex,
            ],
        },
        {
            description: 'assigning argb colors to scss variables with rgb input',
            code: '$myVar: argb(rgb(4, 5, 6));',
            failureCode: '$myVar: argb(rgb(4, 5, 6))',
            colorTypes: [
                ColorType.argb,
                ColorType.rgb,
            ],
        },
    ],
    [Syntax.css]: [
        {
            description: 'allow CSS variable usage',
            code: 'div { color: var(--my-var); }',
            colorTypes: [],
        },
        {
            description: 'allow CSS variable reassignment',
            code: 'div { --my-var: var(--other-var); }',
            colorTypes: [],
        },
        {
            description: 'hex colors (3 character shortcut)',
            code: 'div { color: #000; }',
            failureCode: 'color: #000',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'hex colors',
            code: 'div { color: #000000; }',
            failureCode: 'color: #000000',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'hex colors (with alpha)',
            code: 'div { color: #00000000; }',
            failureCode: 'color: #00000000',
            colorTypes: [ColorType.hex],
        },
        {
            description: 'keyword color',
            code: 'div { color: blue; }',
            failureCode: 'color: blue',
            colorTypes: [ColorType.named],
        },
        {
            description: 'rgb colors',
            code: 'div { color: rgb(0, 0, 0); }',
            failureCode: 'color: rgb(0, 0, 0)',
            colorTypes: [ColorType.rgb],
        },
        {
            description: 'rgba colors',
            code: 'div { color: rgba(0, 0, 0, 0); }',
            failureCode: 'color: rgba(0, 0, 0, 0)',
            colorTypes: [ColorType.rgba],
        },
        {
            description: 'hsl colors',
            code: 'div { color: hsl(0, 0%, 0%); }',
            failureCode: 'color: hsl(0, 0%, 0%)',
            colorTypes: [ColorType.hsl],
        },
        {
            description: 'hsla colors',
            code: 'div { color: hsla(0, 0%, 0%, 0); }',
            failureCode: 'color: hsla(0, 0%, 0%, 0)',
            colorTypes: [ColorType.hsla],
        },
        {
            description: 'hsv colors',
            code: 'div { color: hsv(0, 0%, 0%); }',
            failureCode: 'color: hsv(0, 0%, 0%)',
            colorTypes: [ColorType.hsv],
        },
        {
            description: 'hsva colors',
            code: 'div { color: hsva(0, 0%, 0%, 0); }',
            failureCode: 'color: hsva(0, 0%, 0%, 0)',
            colorTypes: [ColorType.hsva],
        },
        {
            description: 'argb colors with hex input',
            code: 'div { color: argb(#000000); }',
            failureCode: 'color: argb(#000000)',
            colorTypes: [
                ColorType.argb,
                ColorType.hex,
            ],
        },
        {
            description: 'argb colors with rgb input',
            code: 'div { color: argb(rgb(4, 5, 6)); }',
            failureCode: 'color: argb(rgb(4, 5, 6))',
            colorTypes: [
                ColorType.argb,
                ColorType.rgb,
            ],
        },
    ],
};

function rejectSyntaxTestToRejectTestCase(
    test: RejectSyntaxTest,
    /**
     * When this is true, then colorTypes (passed in below) are GOOD. When this is false then the
     * colorTypes passed are BAD.
     */
    requireColorTypes: boolean,
    colorTypes: ColorType[],
): RejectTestCase {
    const failureColorTypes = test.colorTypes.filter((colorType) => {
        const included = colorTypes.includes(colorType);

        if (requireColorTypes) {
            return !included;
        } else {
            return included;
        }
    });

    return {
        ...test,
        description: `reject "${test.description}" test`,
        message: colorTypesRule.messages.includesBlockedColorTypes(
            test.failureCode,
            failureColorTypes,
        ),
    };
}

function getLinterOptionsBySyntax(syntax: Syntax): Partial<LinterOptions> {
    return syntax === Syntax.css
        ? // "css" isn't a syntax option
          {}
        : {
              customSyntax: syntax,
          };
}

/**
 * @param requireColorTypes If true, the given color types are the only ones that should pass. If
 *   false, the given color types should be the only ones that fail.
 */
function generateSyntaxTests(
    colorTypes: ColorType[],
    requireColorTypes: boolean,
    syntax: Syntax,
): DefaultRuleTest<ColorTypesRuleOptions> {
    function filterTest(accept: boolean, test: SyntaxTest) {
        if (!test.colorTypes.length) {
            // always expect tests without a color type to pass
            return accept;
        }

        const tester = requireColorTypes ? 'every' : 'some';

        const includesColorTypes = test.colorTypes[tester]((colorType) =>
            colorTypes.includes(colorType),
        );

        // mode set to require
        if (requireColorTypes) {
            if (includesColorTypes) {
                return accept;
            } else {
                return !accept;
            }
        }
        // mode set to block
        else {
            if (includesColorTypes) {
                return !accept;
            } else {
                return accept;
            }
        }
    }

    const syntaxTests: SyntaxTest[] = testsBySyntax[syntax].concat(
        syntax === Syntax.css ? [] : testsBySyntax[Syntax.css],
    );

    const acceptTests: TestCase[] = syntaxTests
        .filter((test) => filterTest(true, test))
        .map((test) => {
            return {
                ...test,
                description: `allow "${test.description}" test`,
            };
        });

    const rejectTests: RejectTestCase[] = syntaxTests
        .filter((test): test is RejectSyntaxTest => filterTest(false, test))
        .map((test) => rejectSyntaxTestToRejectTestCase(test, requireColorTypes, colorTypes));

    return {
        ruleOptions: {
            mode: requireColorTypes ? DefaultOptionMode.REQUIRE : DefaultOptionMode.BLOCK,
            types: colorTypes,
        },
        linterOptions: getLinterOptionsBySyntax(syntax),
        description: `tests for "${syntax}" syntax`,
        accept: acceptTests,
        reject: rejectTests,
    };
}

function generateDefaultRuleTest(syntax: Syntax): DefaultRuleTest<ColorTypesRuleOptions> {
    const tests = testsBySyntax[syntax].concat(
        syntax === Syntax.css ? [] : testsBySyntax[Syntax.css],
    );

    return {
        ruleOptions: true,
        linterOptions: getLinterOptionsBySyntax(syntax),
        description: `defaults work as expected: block everything for "${syntax}" syntax`,
        accept: tests.filter((test) => !test.colorTypes.length),
        reject: tests
            .filter((test): test is RejectSyntaxTest => !!test.colorTypes.length)
            .map((test) =>
                rejectSyntaxTestToRejectTestCase(test, false, getEnumTypedValues(ColorType)),
            ),
    };
}

function generateAllDefaultRuleTests(): DefaultRuleTest<ColorTypesRuleOptions>[] {
    return getEnumTypedValues(Syntax).map(generateDefaultRuleTest);
}

function generateAllColorTests(): DefaultRuleTest<ColorTypesRuleOptions>[] {
    const testsMatrix: DefaultRuleTest<ColorTypesRuleOptions>[][] = getEnumTypedValues(Syntax).map(
        (syntax): DefaultRuleTest<ColorTypesRuleOptions>[] => {
            const colorTests = getEnumTypedValues(ColorType).map(
                (colorType): DefaultRuleTest<ColorTypesRuleOptions>[] => {
                    return [
                        generateSyntaxTests([colorType], false, syntax),
                        generateSyntaxTests([colorType], true, syntax),
                    ];
                },
            );

            const firstTest = colorTests[0];

            if (!firstTest) {
                throw new Error(`Couldn't find first test in array of tests.`);
            }

            return firstTest.concat(...colorTests.slice(1));
        },
    );

    const firstTestMatrixEntry = testsMatrix[0];

    if (!firstTestMatrixEntry) {
        throw new Error(`Couldn't find first entry in testMatrix.`);
    }

    return firstTestMatrixEntry.concat(...testsMatrix.slice(1));
}

testDefaultRule({
    rule: colorTypesRule,
    pluginPath: pluginPath,
    tests: [
        ...generateAllDefaultRuleTests(),
        ...generateAllColorTests(),
        {
            ruleOptions: {
                mode: DefaultOptionMode.REQUIRE,
                types: [
                    ColorType.hex,
                    ColorType.named,
                    ColorType.rgb,
                ],
            },
            description: 'multiple types work',
            accept: [
                {
                    code: `div {
                        color: #00F;
                        background-color: rgb(0, 0, 255);
                        border-color: blue;
                    }`,
                },
            ],
            reject: [
                {
                    code: `div {
                        color: hsl(240, 100%, 50%);
                    }`,
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        `color: hsl(240, 100%, 50%)`,
                        [ColorType.hsl],
                    ),
                },
                {
                    code: `div {
                        color: hsla(240, 100%, 50%, 0.5);
                    }`,
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        `color: hsla(240, 100%, 50%, 0.5)`,
                        [ColorType.hsla],
                    ),
                },
                {
                    code: `div {
                        background-color: rgba(0, 0, 255, 1);
                    }`,
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        `background-color: rgba(0, 0, 255, 1)`,
                        [ColorType.rgba],
                    ),
                },
                {
                    code: `div {
                        border-color: hsv(240, 100%, 100%);
                    }`,
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        `border-color: hsv(240, 100%, 100%)`,
                        [ColorType.hsv],
                    ),
                },
                {
                    code: `div {
                        border-color: hsva(240, 100%, 100%, 0.5);
                    }`,
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        `border-color: hsva(240, 100%, 100%, 0.5)`,
                        [ColorType.hsva],
                    ),
                },
            ],
        },
    ],
});
