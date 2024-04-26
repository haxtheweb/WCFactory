const { librariesOptions, factoryDir } = require('@wcfactory/common/config')
const { factoryList } = require('@wcfactory/common/factories')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
var packageJson = '';
var factoryAnswer = '';

/**
 * A listing of all prompt questions
 */
// questions
 const questions = [
  {
    type: "list",
    name: "factory",
    message: "Choose your factory",
    require: true,
    store: true,
    choices: factoryList,
    when: (flags) => {
      if (factoryList.length > 1 && !flags.factory) {
        return true;
      } else {
        flags.factory = factoryList[0].value;
        factoryAnswer = factoryList[0].value;
        return false;
      }
    },
  },
  {
    type: "list",
    name: "customElementTemplate",
    message: "Custom element base class to use",
    store: true,
    choices: librariesOptions,
    when: (answers) => {
      if (factoryAnswer == '') {
        factoryAnswer = answers.factory;
      }
      if (!fs.existsSync(path.join(factoryAnswer, 'package.json'))) {
        factoryAnswer = `${factoryDir}/${factoryAnswer}`;
        answers.factory = factoryAnswer;
      }
      packageJson = require(`${factoryAnswer}/package.json`);
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
    type: "confirm",
    name: "useSass",
    when: (flags) => {
      if (!factoryAnswer) {
        return false;
      }
      const packageJson = require(`${factoryAnswer}/package.json`);
      return typeof flags.useSass !== 'boolean' && _.get(packageJson, 'wcfactory.askSASS');
    },
    message: "Do you want to use Sass in this element?",
    store: true
  },
  {
    type: "list",
    name: "sassLibrary",
    message: "Do want to use existing Sass dependencies?",
    when: (answers) => {
      if (!factoryAnswer || !answers.useSass) {
        return false;
      }
      const packageJson = require(`${factoryAnswer}/package.json`);
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
    type: "confirm",
    name: "addProps",
    message: "Do you want custom properties?",
    when: (flags) => {
      if (!factoryAnswer) {
        return false;
      }
      const packageJson = require(`${factoryAnswer}/package.json`);
      return typeof flags.addProps !== 'boolean' && _.get(packageJson, 'wcfactory.askProps')
    },
    store: true
  },
  {
    type: "confirm",
    name: "useHAX",
    message: "Auto build support for the HAX authoring system?",
    store: true,
    when: (answers) => {
      if (!factoryAnswer || !answers.addProps) {
        return false;
      }
      const packageJson = require(`${factoryAnswer}/package.json`);
      return answers.addProps && _.get(packageJson, 'wcfactory.askHAX')
    }
  },
  {
    type: 'recursive',
    message: 'Add a new property?',
    name: 'propsList',
    when: (answers) => {
      if (!factoryAnswer || !answers.addProps) {
        return false;
      }
      return  answers.addProps;
    },
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "Name (eg: title)",
        validate: function (value) {
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
        type: 'confirm',
        name: 'reflectToAttribute',
        message: "Make available in css styles? [name=\"stuff\"] { color: blue; }",
        default: false
      },
      {
        type: 'confirm',
        name: 'observer',
        message: "Observe changes to this property?",
        default: true
      },
    ]
  }
]

module.exports.questions = questions
