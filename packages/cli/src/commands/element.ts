import { Command, flags } from '@oclif/command'
// import { promptUser, getListOptions } from '../utils/commands'
import { getCustomElementClasses } from '../utils/customElementClasses'
import { promptUser } from '../utils/commands'
const customElementClassChoices = getCustomElementClasses()
const cwd = process.cwd();
const packageJson = require(`${cwd}/package.json`);
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/app'), 'wcfactory:app')

export default class Element extends Command {
  static description = 'Create a new element'

  /**
   * @todo dynaimically generate this based on the questions const
   */
  static flags = {
    // global
    help: flags.help({ char: 'h' }),
  }

  async run() {
    let { args, flags } = this.parse(Element)

    env.run('wcfactory:app')

    // questions
    const questions: any = [
      {
        type: "list",
        name: "customElementClassArrayPosition",
        message: "Custom element base class to use",
        store: true,
        choices: customElementClassChoices
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
        type: "input",
        name: "author",
        message: "Author of this element",
        store: true
      },
      {
        type: "input",
        name: "copyrightOwner",
        message: "Copyright owner of this work",
        store: true,
      },
      {
        type: "list",
        name: "license",
        message: "Software License to use",
        store: true,
        default: "apache2",
        choices: [
          {
            name: "Apache 2.0",
            value: "Apache-2.0"
          },
          {
            name: "MIT",
            value: "MIT"
          },
          {
            name: "BSD 3-clause",
            value: "BSD-3-Clause"
          },
          {
            name: "BSD 2-clause",
            value: "BSD-2-Clause"
          }
        ]
      },
      {
        type: "list",
        name: "useSass",
        when: (answers: any) => {
          return packageJson.wcfactory.askSASS;
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
        when: (answers: any) => {
          return answers.useSass && packageJson.wcfactory.askSASS;
        },
        message: "Do want to use existing Sass dependencies?",
        choices: [
          {
            name: packageJson.wcfactory.sass.name,
            value: {
              pkg: packageJson.wcfactory.sass.pkg,
              path: packageJson.wcfactory.sass.path
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
        when: (answers: any) => {
          return packageJson.wcfactory.askProps;
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
        when: (answers: any) => {
          return answers.addProps && packageJson.wcfactory.askHAX;
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
    // prompt the user for remaining flags
    flags = await promptUser(questions, flags, this)
  }
}

/**
 * A listing of all prompt questions
 */

