const { librariesOptions } = require('@wcfactory/common/config')
const { factoryList } = require('@wcfactory/common/factories')
const _ = require('lodash')
var packageJson = '';

/**
 * A listing of all prompt questions
 */
// questions
export const questions: any = [
  {
    type: "list",
    name: "factory",
    message: "Choose your factory",
    require: true,
    store: true,
    choices: factoryList,
    default: () => {
      if (factoryList.length === 1) {
        console.log(`Only one factory, "${factoryList[0].name}" selected.`);
        return factoryList[0].value;
      }
    },
    when: (flags: any) => {
      return (factoryList.length > 1 && !flags.factory)
    },
  },
  {
    type: "list",
    name: "customElementClassArrayPosition",
    message: "Custom element base class to use",
    store: true,
    choices: librariesOptions,
    when: (answers: any) => {
      // account for auto selection
      if (!answers.factory) {
        answers.factory = factoryList[0].value;
      }
      // hack to get packJson for the factory selected loaded dynamically
      packageJson = require(`${answers.factory}/package.json`);
      return packageJson.name;
    }
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
    when: () => {
      return _.get(packageJson, 'wcfactory.askSASS');
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
    message: "Do want to use existing Sass dependencies?",
    when: (answers: any) => {
      return answers.useSass && _.get(packageJson, 'wcfactory.askSASS');
    },
    choices: () => {
      return [
        {
          name: _.get(packageJson, 'wcfactory.sass.name'),
          value: {
            pkg: _.get(packageJson, 'wcfactory.sass.pkg'),
            path: _.get(packageJson, 'wcfactory.sass.path')
          }
        },
        {
          name: "No thanks. I'll provide my own later",
          value: null
        }
      ]
    }
  },
  {
    type: "list",
    name: "addProps",
    message: "Do you want custom properties? (typically yes)",
    when: (answers: any, flags: any) => {
      const packageJson = require(`${answers.factory}/package.json`);
      return _.get(packageJson, 'wcfactory.askProps')
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
    when: (answers: any, flags: any) => {
      const packageJson = require(`${answers.factory}/package.json`);
      return answers.addProps && _.get(packageJson, 'wcfactory.askHAX')
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
