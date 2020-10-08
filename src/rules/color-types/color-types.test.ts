import {
    DefaultOptionMode,
    DefaultRuleTest,
    TestCase,
    testDefaultRule,
} from 'stylelint-rule-creator';
import {pluginPath} from '../../plugin-util';
import {ColorType, colorTypesRule, ColorTypesRuleOptions} from './color-types.rule';

function getObjectTypedKeys<T extends object>(input: T): (keyof T)[] {
    return Object.keys(input) as (keyof T)[];
}

function getEnumTypedKeys<T extends object>(input: T): (keyof T)[] {
    // keys are always strings
    return getObjectTypedKeys(input).filter(key => isNaN(Number(key))) as (keyof T)[];
}

function getEnumTypedValues<T extends object>(input: T): T[keyof T][] {
    const keys = getEnumTypedKeys(input);
    return keys.map(key => input[key]);
}

type Test = TestCase & {messageCode: string; messageType: ColorType};

const scssBlockedTests: Test[] = [
    // scss variables
    {
        description: 'assigning hex colors to scss variables',
        code: '$myVar: #000000;',
        messageCode: '$myVar: #000000',
        messageType: ColorType.hex,
    },
    {
        description: 'assigning keyword colors to scss variables',
        code: '$myVar: blue;',
        messageCode: '$myVar: blue',
        messageType: ColorType.named,
    },
    {
        description: 'assigning rgb colors to scss variables',
        code: '$myVar: rgb(0, 0, 0);',
        messageCode: '$myVar: rgb(0, 0, 0)',
        messageType: ColorType.rgb,
    },
    {
        description: 'assigning rgba colors to scss variables',
        code: '$myVar: rgba(0, 0, 0, 0);',
        messageCode: '$myVar: rgba(0, 0, 0, 0)',
        messageType: ColorType.rgba,
    },
    {
        description: 'assigning hsl colors to scss variables',
        code: '$myVar: hsl(0, 0%, 0%);',
        messageCode: '$myVar: hsl(0, 0%, 0%)',
        messageType: ColorType.hsl,
    },
    {
        description: 'assigning hsla colors to scss variables',
        code: '$myVar: hsla(0, 0%, 0%, 0);',
        messageCode: '$myVar: hsla(0, 0%, 0%, 0)',
        messageType: ColorType.hsla,
    },
    {
        description: 'assigning hsv colors to scss variables',
        code: '$myVar: hsv(0, 0%, 0%);',
        messageCode: '$myVar: hsv(0, 0%, 0%)',
        messageType: ColorType.hsv,
    },
    {
        description: 'assigning hsva colors to scss variables',
        code: '$myVar: hsva(0, 0%, 0%, 0);',
        messageCode: '$myVar: hsva(0, 0%, 0%, 0)',
        messageType: ColorType.hsva,
    },
    {
        description: 'assigning argb colors to scss variables',
        code: '$myVar: argb(#000000);',
        messageCode: '$myVar: argb(#000000)',
        messageType: ColorType.argb,
    },
];

const lessBlockedTests: Test[] = [
    // less variables
    {
        description: 'assigning hex colors to less variables',
        code: '@myVar: #000000;',
        messageCode: '@myVar: #000000',
        messageType: ColorType.hex,
    },
    {
        description: 'assigning keyword colors to less variables',
        code: '@myVar: blue;',
        messageCode: '@myVar: blue',
        messageType: ColorType.named,
    },
    {
        description: 'assigning rgb colors to less variables',
        code: '@myVar: rgb(0, 0, 0);',
        messageCode: '@myVar: rgb(0, 0, 0)',
        messageType: ColorType.rgb,
    },
    {
        description: 'assigning rgba colors to less variables',
        code: '@myVar: rgba(0, 0, 0, 0);',
        messageCode: '@myVar: rgba(0, 0, 0, 0)',
        messageType: ColorType.rgba,
    },
    {
        description: 'assigning hsl colors to less variables',
        code: '@myVar: hsl(0, 0%, 0%);',
        messageCode: '@myVar: hsl(0, 0%, 0%)',
        messageType: ColorType.hsl,
    },
    {
        description: 'assigning hsla colors to less variables',
        code: '@myVar: hsla(0, 0%, 0%, 0);',
        messageCode: '@myVar: hsla(0, 0%, 0%, 0)',
        messageType: ColorType.hsla,
    },
    {
        description: 'assigning hsv colors to less variables',
        code: '@myVar: hsv(0, 0%, 0%);',
        messageCode: '@myVar: hsv(0, 0%, 0%)',
        messageType: ColorType.hsv,
    },
    {
        description: 'assigning hsva colors to less variables',
        code: '@myVar: hsva(0, 0%, 0%, 0);',
        messageCode: '@myVar: hsva(0, 0%, 0%, 0)',
        messageType: ColorType.hsva,
    },
    {
        description: 'assigning argb colors to less variables',
        code: '@myVar: argb(#000000);',
        messageCode: '@myVar: argb(#000000)',
        messageType: ColorType.argb,
    },
];

const allBlockedTests: Test[] = [
    // color values
    {
        description: 'hex colors (3 character shortcut)',
        code: 'div { color: #000; }',
        messageCode: 'color: #000',
        messageType: ColorType.hex,
    },
    {
        description: 'hex colors',
        code: 'div { color: #000000; }',
        messageCode: 'color: #000000',
        messageType: ColorType.hex,
    },
    {
        description: 'hex colors (with alpha)',
        code: 'div { color: #00000000; }',
        messageCode: 'color: #00000000',
        messageType: ColorType.hex,
    },
    {
        description: 'keyword colors',
        code: 'div { color: blue; }',
        messageCode: 'color: blue',
        messageType: ColorType.named,
    },
    {
        description: 'keyword colors',
        code: '.mixin-definition(@my-color: blue) {}',
        messageCode: '@my-color: blue',
        messageType: ColorType.named,
    },
    {
        description: 'keyword colors',
        code: '.mixin-name(@varA: @my-color-A, @varB: @my-color-B, @varC: @white, @varD: white) {}',
        messageCode: '@varD: white',
        messageType: ColorType.named,
    },
    {
        description: 'rgb colors',
        code: 'div { color: rgb(0, 0, 0); }',
        messageCode: 'color: rgb(0, 0, 0)',
        messageType: ColorType.rgb,
    },
    {
        description: 'rgba colors',
        code: 'div { color: rgba(0, 0, 0, 0); }',
        messageCode: 'color: rgba(0, 0, 0, 0)',
        messageType: ColorType.rgba,
    },
    {
        description: 'hsl colors',
        code: 'div { color: hsl(0, 0%, 0%); }',
        messageCode: 'color: hsl(0, 0%, 0%)',
        messageType: ColorType.hsl,
    },
    {
        description: 'hsla colors',
        code: 'div { color: hsla(0, 0%, 0%, 0); }',
        messageCode: 'color: hsla(0, 0%, 0%, 0)',
        messageType: ColorType.hsla,
    },
    {
        description: 'hsv colors',
        code: 'div { color: hsv(0, 0%, 0%); }',
        messageCode: 'color: hsv(0, 0%, 0%)',
        messageType: ColorType.hsv,
    },
    {
        description: 'hsva colors',
        code: 'div { color: hsva(0, 0%, 0%, 0); }',
        messageCode: 'color: hsva(0, 0%, 0%, 0)',
        messageType: ColorType.hsva,
    },
    {
        description: 'argb colors',
        code: 'div { color: argb(#000000); }',
        messageCode: 'color: argb(#000000)',
        messageType: ColorType.argb,
    },
];

const scssVariableAssignments: TestCase[] = [
    // scss
    {
        description: 'allow SCSS variable usage',
        code: 'div { color: $myVar; }',
    },
    {
        description: 'allow SCSS variable reassignment',
        code: '$myVar: $otherVar',
    },
];

const lessVariableAssignments: TestCase[] = [
    // less
    {
        description: 'allow less variable usage',
        code: 'div { color: @myVar; }',
    },
    {
        description: 'allow less variable reassignment',
        code: '@myVar: @otherVar;',
    },
];

const variableAssignments: TestCase[] = [
    // native CSS variables
    {
        description: 'allow CSS variable usage',
        code: 'div { color: var(--my-var); }',
    },
    {
        description: 'allow CSS variable reassignment',
        code: 'div { --my-var: var(--other-var); }',
    },
];

const defaultRule = {
    ruleOptions: true,
    description: 'defaults work as expected: block everything',
    accept: [
        ...variableAssignments,
        {
            description: 'ignore parsing errors for mixin rule checking',
            code: 'div {& :not(.my-class-here) when (@thing = false) {}}',
        },
    ],
    reject: allBlockedTests.map(test => {
        return {
            description: `block ${test.description}`,
            code: test.code,
            message: colorTypesRule.messages.includesBlockedColorTypes(test.messageCode, [
                test.messageType,
            ]),
        };
    }),
};

function generateBlockTests(syntax?: 'less' | 'scss') {
    return getEnumTypedValues(ColorType).map(
        (colorType: ColorType): DefaultRuleTest<ColorTypesRuleOptions> => {
            const additionalVariables =
                syntax === 'less'
                    ? lessVariableAssignments
                    : syntax === 'scss'
                    ? scssVariableAssignments
                    : [];

            const blockedTests = [
                ...allBlockedTests,
                ...(syntax === 'less'
                    ? lessBlockedTests
                    : syntax === 'scss'
                    ? scssBlockedTests
                    : []),
            ];
            return {
                ruleOptions: {mode: DefaultOptionMode.BLOCK, types: [colorType]},
                description: `block ${colorType} values`,
                accept: [
                    ...blockedTests.filter(test => test.messageType !== colorType),
                    ...variableAssignments,
                    ...additionalVariables,
                ],
                reject: blockedTests
                    .filter(test => test.messageType === colorType)
                    .map(test => {
                        return {
                            description: `block ${test.description}`,
                            code: test.code,
                            message: colorTypesRule.messages.includesBlockedColorTypes(
                                test.messageCode,
                                [test.messageType],
                            ),
                        };
                    }),
            };
        },
    );
}

function generateRequireTests(syntax?: 'less' | 'scss') {
    return getEnumTypedValues(ColorType).map(
        (colorType: ColorType): DefaultRuleTest<ColorTypesRuleOptions> => {
            const additionalVariables =
                syntax === 'less'
                    ? lessVariableAssignments
                    : syntax === 'scss'
                    ? scssVariableAssignments
                    : [];

            const blockedTests = [
                ...allBlockedTests,
                ...(syntax === 'less'
                    ? lessBlockedTests
                    : syntax === 'scss'
                    ? scssBlockedTests
                    : []),
            ];

            const test: DefaultRuleTest<ColorTypesRuleOptions> = {
                ruleOptions: {mode: DefaultOptionMode.REQUIRE, types: [colorType]},
                description: `require ${colorType} values`,
                accept: [
                    ...blockedTests.filter(test => test.messageType === colorType),
                    ...variableAssignments,
                    ...additionalVariables,
                ],
                reject: blockedTests
                    .filter(test => test.messageType !== colorType)
                    .map(test => {
                        return {
                            description: `block ${test.description}`,
                            code: test.code,
                            message: colorTypesRule.messages.includesBlockedColorTypes(
                                test.messageCode,
                                [test.messageType],
                            ),
                        };
                    }),
            };

            if (syntax) {
                test.linterOptions = {
                    syntax: 'less',
                };
            }

            return test;
        },
    );
}

testDefaultRule({
    rule: colorTypesRule,
    pluginPath: pluginPath,
    tests: [
        ...generateRequireTests(),
        ...generateRequireTests('less'),
        ...generateRequireTests('scss'),
        ...generateBlockTests(),
        ...generateBlockTests('less'),
        ...generateBlockTests('scss'),
        defaultRule,
        {
            ...defaultRule,
            linterOptions: {
                syntax: 'less',
            },
            description: defaultRule.description + ' with less syntax',
        },
        {
            ...defaultRule,
            linterOptions: {
                syntax: 'scss',
            },
            description: defaultRule.description + ' with scss syntax',
        },
    ],
});
