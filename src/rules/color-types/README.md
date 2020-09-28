# `color-types`

_autofixable_: maybe

TODO

-   By default, TODO: description

    ```javascript
    "plugin-color/color-types": true // same as {"mode": "require"}
    ```

-   Modes:

    ```javascript
    "plugin-color/color-types": {
        "mode": "require"
    }
    ```

    ```javascript
    "plugin-color/color-types": {
        "mode": "block",
    }
    ```

## Examples

-   Defaults:

    ```javascript
     "plugin-color/color-types": true // same as {"mode": "require"}
    ```

    -   ![](https://placehold.it/15/008000/008000?text=+) **<span style="color: green;">Good</span>**

        ```less
        todo: code;
        ```

    -   ![](https://placehold.it/15/FF0000/FF0000?text=+) **<span style="color: red;">Bad</span>**

        ```less
        todo: code;
        ```

        autofix output:

        ```less
        todo: code;
        ```

-   `block` mode:

    ```javascript
     "plugin-color/color-types": {"mode": "block"}
    ```

    -   ![](https://placehold.it/15/008000/008000?text=+) **<span style="color: green;">Good</span>**

        ```less
        todo: code;
        ```

    -   ![](https://placehold.it/15/FF0000/FF0000?text=+) **<span style="color: red;">Bad</span>**

        ```less
        todo: code;
        ```

        autofix output:

        ```less
        todo: code;
        ```
