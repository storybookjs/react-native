"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("@storybook/angular");
var addon_actions_1 = require("@storybook/addon-actions");
var addon_knobs_1 = require("@storybook/addon-knobs");
var knobs_component_1 = require("./knobs.component");
var all_knobs_component_1 = require("./all-knobs.component");
angular_1.storiesOf('Addon|Knobs', module)
    .addDecorator(addon_knobs_1.withKnobs)
    .add('Simple', function () {
    var name = addon_knobs_1.text('name', 'John Doe');
    var age = addon_knobs_1.number('age', 0);
    var phoneNumber = addon_knobs_1.text('phoneNumber', '555-55-55');
    return {
        moduleMetadata: {
            entryComponents: [knobs_component_1.SimpleKnobsComponent],
            declarations: [knobs_component_1.SimpleKnobsComponent],
        },
        template: "\n        <h1> This is a template </h1>\n        <storybook-simple-knobs-component\n          [age]=\"age\"\n          [phoneNumber]=\"phoneNumber\"\n          [name]=\"name\"\n        >\n        </storybook-simple-knobs-component>\n      ",
        props: {
            name: name,
            age: age,
            phoneNumber: phoneNumber,
        },
    };
})
    .add('All knobs', function () {
    var name = addon_knobs_1.text('name', 'Jane');
    var stock = addon_knobs_1.number('stock', 20, {
        range: true,
        min: 0,
        max: 30,
        step: 5,
    });
    var fruits = {
        Apple: 'apples',
        Banana: 'bananas',
        Cherry: 'cherries',
    };
    var fruit = addon_knobs_1.select('fruit', fruits, 'apples');
    var otherFruits = {
        Kiwi: 'kiwi',
        Guava: 'guava',
        Watermelon: 'watermelon',
    };
    var otherFruit = addon_knobs_1.radios('Other Fruit', otherFruits, 'watermelon');
    var price = addon_knobs_1.number('price', 2.25);
    var border = addon_knobs_1.color('border', 'deeppink');
    var today = addon_knobs_1.date('today', new Date('Jan 20 2017'));
    var items = addon_knobs_1.array('items', ['Laptop', 'Book', 'Whiskey']);
    var nice = addon_knobs_1.boolean('nice', true);
    addon_knobs_1.button('Arbitrary action', addon_actions_1.action('You clicked it!'));
    return {
        component: all_knobs_component_1.AllKnobsComponent,
        props: {
            name: name,
            stock: stock,
            fruit: fruit,
            otherFruit: otherFruit,
            price: price,
            border: border,
            today: today,
            items: items,
            nice: nice,
        },
    };
})
    .add('XSS safety', function () { return ({
    template: addon_knobs_1.text('Rendered string', '<img src=x onerror="alert(\'XSS Attack\')" >'),
}); });
