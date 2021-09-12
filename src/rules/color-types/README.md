# `color-types`

_autofixable_: no

Block or require certain color types to be used in stylesheets.

-   By default, blocks all color literals

    ```javascript
    "plugin-color/color-types": true
    ```

## Color Types

This is a required property.

```javascript
"plugin-color/color-types": {
    "mode": "require",
    // type strings go in this array
    "types": ["rgb", "hsl", etc.]
}
```

All available color types:

-   `"hex"`
-   `"named"`
-   `"rgb"`
-   `"rgba"`
-   `"hsl"`
-   `"hsla"`
-   `"hsv"`
-   `"hsva"`
-   `"argb"`

## Modes

-   Require

    ```javascript
    "plugin-color/color-types": {
        "mode": "require",
        "types": [...],
    }
    ```

    Example: require all color usage to be in rgb

    ```javascript
    "plugin-color/color-types": {
        "mode": "require",
        "types": ["rgb"],
    }
    ```

-   Block

    ```javascript
    "plugin-color/color-types": {
        "mode": "block",
        "types": [...],
    }
    ```

    Example: block all rgb usage (and allow all other formats)

    ```javascript
    "plugin-color/color-types": {
        "mode": "block",
        "types": ["rgb"],
    }
    ```

## Examples

-   Defaults:

    ```javascript
     "plugin-color/color-types": true // same as all color types being blocked
    ```

    -   ![](https://placehold.it/15/008000/008000?text=+) **<span style="color: green;">Good</span>**

        ```less
        div {
            color: @myColorVar;
        }
        ```

        ```css
        div {
            color: var(--my-color-var);
        }
        ```

        ```scss
        div {
            color: $myColorVar;
        }
        ```

    -   ![](https://placehold.it/15/FF0000/FF0000?text=+) **<span style="color: red;">Bad</span>**

        ```less
        div {
            color: #000;
        }
        ```

        ```css
        div {
            color: rgb(255, 255, 255);
        }
        ```

        ```scss
        div {
            color: blue;
        }
        ```

-   `require` mode with single type:

    ```javascript
     "plugin-color/color-types": {
        "mode": "require",
        "types": ["rgb"]
    }
    ```

    -   ![](https://placehold.it/15/008000/008000?text=+) **<span style="color: green;">Good</span>**

        ```less
        div {
            color: rgb(255, 255, 255);
        }
        ```

    -   ![](https://placehold.it/15/FF0000/FF0000?text=+) **<span style="color: red;">Bad</span>**

        ```less
        div {
            color: #000;
        }
        ```

        ```css
        div {
            color: rgba(255, 255, 255, 0.4);
        }
        ```

        ```scss
        div {
            color: blue;
        }
        ```

-   `require` mode with multiple type:

    ```javascript
     "plugin-color/color-types": {
        "mode": "require",
        "types": ["rgb", "named"]
    }
    ```

    -   ![](https://placehold.it/15/008000/008000?text=+) **<span style="color: green;">Good</span>**

        ```less
        div {
            color: rgb(255, 255, 255);
        }
        ```

        ```less
        div {
            color: blue;
        }
        ```

    -   ![](https://placehold.it/15/FF0000/FF0000?text=+) **<span style="color: red;">Bad</span>**

        ```less
        div {
            color: #000;
        }
        ```

        ```css
        div {
            color: rgba(255, 255, 255, 0.4);
        }
        ```

        ```scss
        div {
            color: blue;
        }
        ```

-   `block` mode with single type:

    ```javascript
     "plugin-color/color-types": {
        "mode": "block",
        "types": ["hex"]
    }
    ```

    -   ![](https://placehold.it/15/008000/008000?text=+) **<span style="color: green;">Good</span>**

        ```less
        div {
            color: rgb(255, 255, 255);
        }
        ```

        ```less
        div {
            color: blue;
        }
        ```

    -   ![](https://placehold.it/15/FF0000/FF0000?text=+) **<span style="color: red;">Bad</span>**

        ```less
        div {
            color: #000;
        }
        ```

        ```less
        div {
            color: #0000ff;
        }
        ```

-   `block` mode with multiple types:

    ```javascript
     "plugin-color/color-types": {
        "mode": "block",
        "types": ["hex", "rgba"]
    }
    ```

    -   ![](https://placehold.it/15/008000/008000?text=+) **<span style="color: green;">Good</span>**

        ```less
        div {
            color: rgb(255, 255, 255);
        }
        ```

        ```less
        div {
            color: blue;
        }
        ```

    -   ![](https://placehold.it/15/FF0000/FF0000?text=+) **<span style="color: red;">Bad</span>**

        ```less
        div {
            color: #000;
        }
        ```

        ```less
        div {
            color: #0000ff;
        }
        ```

        ```less
        div {
            color: rgba(0, 0, 255, 0.5);
        }
        ```
