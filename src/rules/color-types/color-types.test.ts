import {DefaultOptionMode, testDefaultRule} from 'stylelint-rule-creator';
import {pluginPath} from '../../plugin-util';
import {ColorType, colorTypesRule} from './color-types.rule';

testDefaultRule({
    rule: colorTypesRule,
    pluginPath: pluginPath,
    tests: [
        {
            ruleOptions: {mode: DefaultOptionMode.REQUIRE, types: []},
            description: 'TODO: add more tests',
            accept: [
                {
                    code: '',
                    description: 'TODO',
                },
            ],
            reject: [],
        },
        {
            ruleOptions: true,
            description: 'defaults work as expected',
            accept: [
                {
                    description: 'allow CSS variable usage',
                    code: 'div { color: var(--my-var); }',
                },
                {
                    description: 'allow CSS variable reassignment',
                    code: 'div { --my-var: var(--other-var); }',
                },
                // scss
                {
                    description: 'allow SCSS variable usage',
                    code: 'div { color: $myVar; }',
                },
                {
                    description: 'allow SCSS variable reassignment',
                    code: '$myVar: $otherVar',
                },
                // less
                {
                    description: 'allow less variable usage',
                    code: 'div { color: @myVar; }',
                },
                {
                    description: 'allow less variable reassignment',
                    code: '@myVar: @otherVar;',
                },
            ],
            reject: [
                // color values
                {
                    description: 'block hex colors',
                    code: 'div { color: #000000; }',
                    message: colorTypesRule.messages.includesBlockedColorTypes('color: #000000', [
                        ColorType.hex,
                    ]),
                },
                {
                    description: 'block keyword colors',
                    code: 'div { color: blue; }',
                    message: colorTypesRule.messages.includesBlockedColorTypes('color: blue', [
                        ColorType.named,
                    ]),
                },
                {
                    description: 'block rgb colors',
                    code: 'div { color: rgb(0, 0, 0); }',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        'color: rgb(0, 0, 0)',
                        [ColorType.rgb],
                    ),
                },
                {
                    description: 'block rgba colors',
                    code: 'div { color: rgba(0, 0, 0, 0); }',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        'color: rgba(0, 0, 0, 0)',
                        [ColorType.rgba],
                    ),
                },
                {
                    description: 'block hsl colors',
                    code: 'div { color: hsl(0, 0%, 0%); }',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        'color: hsl(0, 0%, 0%)',
                        [ColorType.hsl],
                    ),
                },
                {
                    description: 'block hsla colors',
                    code: 'div { color: hsla(0, 0%, 0%, 0); }',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        'color: hsla(0, 0%, 0%, 0)',
                        [ColorType.hsla],
                    ),
                },
                {
                    description: 'block hsv colors',
                    code: 'div { color: hsv(0, 0%, 0%); }',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        'color: hsv(0, 0%, 0%)',
                        [ColorType.hsv],
                    ),
                },
                {
                    description: 'block hsva colors',
                    code: 'div { color: hsva(0, 0%, 0%, 0); }',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        'color: hsva(0, 0%, 0%, 0)',
                        [ColorType.hsva],
                    ),
                },
                {
                    description: 'block argb colors',
                    code: 'div { color: argb(#000000); }',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        'color: argb(#000000)',
                        [ColorType.argb],
                    ),
                },
                // less variables
                {
                    description: 'block assigning hex colors to less variables',
                    code: '@myVar: #000000;',
                    message: colorTypesRule.messages.includesBlockedColorTypes('@myVar: #000000', [
                        ColorType.hex,
                    ]),
                },
                {
                    description: 'block assigning keyword colors to less variables',
                    code: '@myVar: blue;',
                    message: colorTypesRule.messages.includesBlockedColorTypes('@myVar: blue', [
                        ColorType.named,
                    ]),
                },
                {
                    description: 'block assigning rgb colors to less variables',
                    code: '@myVar: rgb(0, 0, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '@myVar: rgb(0, 0, 0)',
                        [ColorType.rgb],
                    ),
                },
                {
                    description: 'block assigning rgba colors to less variables',
                    code: '@myVar: rgba(0, 0, 0, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '@myVar: rgba(0, 0, 0, 0)',
                        [ColorType.rgba],
                    ),
                },
                {
                    description: 'block assigning hsl colors to less variables',
                    code: '@myVar: hsl(0, 0%, 0%);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '@myVar: hsl(0, 0%, 0%)',
                        [ColorType.hsl],
                    ),
                },
                {
                    description: 'block assigning hsla colors to less variables',
                    code: '@myVar: hsla(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '@myVar: hsla(0, 0%, 0%, 0)',
                        [ColorType.hsla],
                    ),
                },
                {
                    description: 'block assigning hsv colors to less variables',
                    code: '@myVar: hsv(0, 0%, 0%);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '@myVar: hsv(0, 0%, 0%)',
                        [ColorType.hsv],
                    ),
                },
                {
                    description: 'block assigning hsva colors to less variables',
                    code: '@myVar: hsva(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '@myVar: hsva(0, 0%, 0%, 0)',
                        [ColorType.hsva],
                    ),
                },
                {
                    description: 'block assigning argb colors to less variables',
                    code: '@myVar: argb(#000000);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '@myVar: argb(#000000)',
                        [ColorType.argb],
                    ),
                },
                // scss variables
                {
                    description: 'block assigning hex colors to scss variables',
                    code: '$myVar: #000000;',
                    message: colorTypesRule.messages.includesBlockedColorTypes('$myVar: #000000', [
                        ColorType.hex,
                    ]),
                },
                {
                    description: 'block assigning keyword colors to scss variables',
                    code: '$myVar: blue;',
                    message: colorTypesRule.messages.includesBlockedColorTypes('$myVar: blue', [
                        ColorType.named,
                    ]),
                },
                {
                    description: 'block assigning rgb colors to scss variables',
                    code: '$myVar: rgb(0, 0, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '$myVar: rgb(0, 0, 0)',
                        [ColorType.rgb],
                    ),
                },
                {
                    description: 'block assigning rgba colors to scss variables',
                    code: '$myVar: rgba(0, 0, 0, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '$myVar: rgba(0, 0, 0, 0)',
                        [ColorType.rgba],
                    ),
                },
                {
                    description: 'block assigning hsl colors to scss variables',
                    code: '$myVar: hsl(0, 0%, 0%);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '$myVar: hsl(0, 0%, 0%)',
                        [ColorType.hsl],
                    ),
                },
                {
                    description: 'block assigning hsla colors to scss variables',
                    code: '$myVar: hsla(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '$myVar: hsla(0, 0%, 0%, 0)',
                        [ColorType.hsla],
                    ),
                },
                {
                    description: 'block assigning hsv colors to scss variables',
                    code: '$myVar: hsv(0, 0%, 0%);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '$myVar: hsv(0, 0%, 0%)',
                        [ColorType.hsv],
                    ),
                },
                {
                    description: 'block assigning hsva colors to scss variables',
                    code: '$myVar: hsva(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '$myVar: hsva(0, 0%, 0%, 0)',
                        [ColorType.hsva],
                    ),
                },
                {
                    description: 'block assigning argb colors to scss variables',
                    code: '$myVar: argb(#000000);',
                    message: colorTypesRule.messages.includesBlockedColorTypes(
                        '$myVar: argb(#000000)',
                        [ColorType.argb],
                    ),
                },
            ],
        },
    ],
});
