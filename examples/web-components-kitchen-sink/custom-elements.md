# demo-wc-card

This is a container looking like a card with a back and front side you can switch

## Properties

| Property   | Attribute   | Type         | Default        | Description                        |
|------------|-------------|--------------|----------------|------------------------------------|
| `backSide` | `back-side` | `boolean`    | false          |                                    |
| `header`   | `header`    | `string`     | "Your Message" |                                    |
| `rows`     | `rows`      | `never[]`    |                |                                    |
| `side`     |             | `"A" \| "B"` |                | A card setter can have side A or B |

## Events

| Event          | Description                                   |
|----------------|-----------------------------------------------|
| `side-changed` | Fires whenever it switches between front/back |

## CSS Custom Properties

| Property                          | Description          |
|-----------------------------------|----------------------|
| `--demo-wc-card-back-color`       | Font color for back  |
| `--demo-wc-card-front-color`      | Font color for front |
| `--demo-wc-card-header-font-size` | Header font size     |

## Slots

| Name | Description                                |
|------|--------------------------------------------|
|      | This is an unnamed slot (the default slot) |
