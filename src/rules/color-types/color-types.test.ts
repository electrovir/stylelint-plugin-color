import {testDefaultRule} from 'stylelint-rule-creator';
import {pluginPath} from '../../plugin-util';
import {colorTypesRule} from './color-types.rule';

testDefaultRule({
    rule: colorTypesRule,
    pluginPath: pluginPath,
    tests: [
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
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block keyword colors',
                    code: 'div { color: blue; }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block rgb colors',
                    code: 'div { color: rgb(0, 0, 0); }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block rgba colors',
                    code: 'div { color: rgba(0, 0, 0, 0); }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block hsl colors',
                    code: 'div { color: hsl(0, 0%, 0%); }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block hsla colors',
                    code: 'div { color: hsla(0, 0%, 0%, 0); }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block hsv colors',
                    code: 'div { color: hsv(0, 0%, 0%); }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block hsva colors',
                    code: 'div { color: hsva(0, 0%, 0%, 0); }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block argb colors',
                    code: 'div { color: argb(#000000); }',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                // less variables
                {
                    description: 'block assigning hex colors to less variables',
                    code: '@myVar: #000000;',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning keyword colors to less variables',
                    code: '@myVar: blue;',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning rgb colors to less variables',
                    code: '@myVar: rgb(0, 0, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning rgba colors to less variables',
                    code: '@myVar: rgba(0, 0, 0, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsl colors to less variables',
                    code: '@myVar: hsl(0, 0%, 0%);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsla colors to less variables',
                    code: '@myVar: hsla(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsv colors to less variables',
                    code: '@myVar: hsv(0, 0%, 0%);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsva colors to less variables',
                    code: '@myVar: hsva(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning argb colors to less variables',
                    code: '@myVar: argb(#000000);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                // scss variables
                {
                    description: 'block assigning hex colors to scss variables',
                    code: '$myVar: #000000;',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning keyword colors to scss variables',
                    code: '$myVar: blue;',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning rgb colors to scss variables',
                    code: '$myVar: rgb(0, 0, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning rgba colors to scss variables',
                    code: '$myVar: rgba(0, 0, 0, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsl colors to scss variables',
                    code: '$myVar: hsl(0, 0%, 0%);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsla colors to scss variables',
                    code: '$myVar: hsla(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsv colors to scss variables',
                    code: '$myVar: hsv(0, 0%, 0%);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning hsva colors to scss variables',
                    code: '$myVar: hsva(0, 0%, 0%, 0);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
                {
                    description: 'block assigning argb colors to scss variables',
                    code: '$myVar: argb(#000000);',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
            ],
        },
    ],
});
