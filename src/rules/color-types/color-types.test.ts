import {testDefaultRule} from 'stylelint-rule-creator';
import {pluginPath} from '../../plugin-util';
import {colorTypesRule} from './color-types.rule';

testDefaultRule({
    rule: colorTypesRule,
    pluginPath: pluginPath,
    tests: [
        // TODO: implement tests
        {
            ruleOptions: true,
            description: 'defaults work as expected',
            accept: [{code: ''}],
            reject: [
                {
                    code: '',
                    message: colorTypesRule.messages.invalidColorDefinition(''),
                },
            ],
        },
    ],
});
