import {prefix} from '../../plugin-util';
import {
    createDefaultRule,
    DefaultOptionMode,
    doesMatchLineExceptions,
} from 'stylelint-rule-creator';

const messages = {
    invalidColorDefinition(colorDefinition: string) {
        return `Blocked color definition: ${colorDefinition}`;
    },
};

export const colorTypesRule = createDefaultRule<typeof messages>({
    ruleName: `${prefix}/color-types`,
    messages,
    defaultOptions: {
        mode: DefaultOptionMode.REQUIRE,
    },
    ruleCallback: (report, messages, {ruleOptions, root, context, exceptionRegExps}) => {
        root.walkAtRules('import', atRule => {
            if (doesMatchLineExceptions(atRule, exceptionRegExps)) {
                return;
            }

            if (ruleOptions.mode === DefaultOptionMode.REQUIRE) {
                if (context.fix) {
                    // TODO: implement fix behavior for require
                    // const newNode = atRule.clone();
                    // atRule.replaceWith(newNode);
                } else {
                    // TODO: report on require
                    // report({
                    //     message: messages.invalidColorDefinition(atRule.toString()),
                    //     node: atRule,
                    //     word: atRule.toString(),
                    // });
                }
            } else if (ruleOptions.mode === DefaultOptionMode.BLOCK) {
                if (context.fix) {
                    // TODO: implement fix behavior for block
                    // const newNode = atRule.clone();
                    // atRule.replaceWith(newNode);
                } else {
                    // TODO: report on block
                    // report({
                    //     message: messages.invalidColorDefinition(atRule.toString()),
                    //     node: atRule,
                    //     word: atRule.toString(),
                    // });
                }
            }
        });
    },
});
