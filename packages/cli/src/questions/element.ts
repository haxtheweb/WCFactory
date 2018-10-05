const { config, librariesOptions } = require('@wcfactory/common/config')
const _ = require('lodash')

/**
 * A listing of all prompt questions
 */
// questions
export const questions: any = [
  {
    type: "list",
    name: "customElementClassArrayPosition",
    message: "Custom element base class to use",
    store: true,
    choices: librariesOptions
  },
  {
    type: "input",
    name: "name",
    message: "Element name",
    validate: function (value) {
      if ((/([a-z]*)-([a-z]*)/).test(value)) { return true; }
      return 'name requires a hyphen and all lowercase';
    }
  },
  {
    type: "input",
    name: "description",
    message: "Description / purpose of the element"
  },
  {
    type: "list",
    name: "useSass",
    when: (flags: any) => {
      return _.get(config, 'wcfactory.askSASS');
    },
    message: "Do you want to use Sass in this element?",
    store: true,
    choices: [
      {
        name: "Yes",
        value: true
      },
      {
        name: "No",
        value: false
      }
    ]
  },
  {
    type: "list",
    name: "sassLibrary",
    when: (flags: any) => {
      return flags.useSass && _.get(config, 'wcfactory.askSASS');
    },
    message: "Do want to use existing Sass dependencies?",
    choices: [
      {
        name: _.get(config, 'wcfactory.sass.name'),
        value: {
          pkg: _.get(config, 'wcfactory.sass.pkg'),
          path: _.get(config, 'wcfactory.sass.path')
        }
      },
      {
        name: "No thanks. I'll provide my own later",
        value: null
      }
    ]
  },
  {
    type: "list",
    name: "addProps",
    message: "Do you want custom properties? (typically yes)",
    when: (flags: any) => {
      return _.get(config, 'wcfactory.askProps')
    },
    store: true,
    choices: [
      {
        name: "Yes",
        value: true
      },
      {
        name: "No",
        value: false
      }
    ]
  },
  {
    type: "list",
    name: "useHAX",
    message: "Auto build support for the HAX authoring system?",
    store: true,
    when: (flags: any) => {
      return flags.addProps && _.get(config, 'wcfactory.askHAX');
    },
    choices: [
      {
        name: "Yes",
        value: true
      },
      {
        name: "No",
        value: false
      }
    ]
  },
  {
    type: 'recursive',
    message: 'Add a new property?',
    name: 'propsList',
    when: (answers: any) => {
      return answers.addProps;
    },
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "Name (eg: title)",
        validate: function (value: any) {
          if ((/\w/).test(value)) { return true; }
          return 'Property name must be a single word';
        }
      },
      {
        type: 'list',
        name: 'type',
        message: "type of value (the way it is used as data)",
        default: "String",
        choices: [
          {
            name: "String, text based input",
            value: "String"
          },
          {
            name: "Boolean, true/false value",
            value: "Boolean"
          },
          {
            name: "Number, number like 54",
            value: "Number"
          },
          {
            name: "Object, complex item storing multiple types",
            value: "Object"
          },
          {
            name: "Array, list of types",
            value: "Array"
          },
          {
            name: "Date, javascript date based object",
            value: "Date"
          },
        ]
      },
      {
        type: 'input',
        name: 'value',
        message: "Default value (leave blank for none)",
      },
      {
        type: 'list',
        name: 'reflectToAttribute',
        message: "Make available in css styles? [name=\"stuff\"] { color: blue; }",
        default: false,
        choices: [
          {
            name: "No",
            value: false
          },
          {
            name: "Yes",
            value: true
          },
        ]
      },
      {
        type: 'list',
        name: 'observer',
        message: "Notice changes to this property?",
        default: true,
        choices: [
          {
            name: "Yes",
            value: true
          },
          {
            name: "No",
            value: false
          },
        ]
      },
    ]
  }
]
