# Stylelint Plugin Color

Stylelint plugin for managing colors. Includes Less support.

# Rule Options

All rules respect the following primary option format and _no_ secondary options:

-   boolean input

    ```javascript
    {
        "rule-name": true // use default rule behavior
    }
    ```

    ```javascript
    {
        "rule-name": false // disables rule
    }
    ```

-   object input

    ```javascript
    {
        "mode": "require" // requires the rule's default
    }
    ```

    ```javascript
    {
        "mode": "block" // blocks the rule's default
    }
    ```

    ```javascript
    {
        "mode": "off" // disable rule
    }
    ```

-   object input with exceptions

    ```javascript
    {
        "mode": "require",
        // optional input
        // these use glob matching with globstar turned ON
        "fileExceptions": [
            "**/*colors.less", // ignores any files ending in colors.less in any directory
            "*colors.less" // ignore files ending in colors.less only in the current directory
        ]
        // optional input
        // these use glob matching with globstar turned OFF
        "lineExceptions": [
            "*colors*", // ignores all lines that include the word colors
            "@import 'colors'" // ignores all lines that are exactly this string (don't include semicolons)
        ],
    }
    ```

# Rules

Go to each rule's page (click on the name below) to see specific details.

| Rule                                              | auto-fix |
| ------------------------------------------------- | -------- |
| [plugin-color/color-types](src/rules/color-types) | maybe    |
