import { Command, flags } from '@oclif/command'
import * as path from 'path'
import * as Case from 'case'
var emoji = require('node-emoji')
var inquirer = require('inquirer')
var prompt = inquirer.createPromptModule();
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/init'), 'wcfactory:init')

export default class Init extends Command {
  static description = 'Create mono repo for your element library. You will only need to do this once.'

  /**
   * @todo dynaimically generate this based on the questions const
   */
  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    orgNpm: flags.string({ char: 'o', description: 'NPM organization name (include @)' }),
    orgGit: flags.string({ char: 'O', description: 'Git organization name' }),
    name: flags.string({ char: 'n', description: 'Git organization name' }),
    gitRepo: flags.string({ char: 'g', description: 'Your Repo name. Must be a valid git/npm name' }),
  }

  async run() {
    // process the user input
    const { args, flags } = this.parse(Init)

    /**
     * A little async iterator for prompts
     */
    for await (let q of questions) {
      // get the name of the question
      const name = q.name
      // if the user already answered this flag then
      // log it out and skip it
      if (flags[name]) {
        this.log(`${emoji.emojify(q.emoji)} ${q.message}: ${flags[name]}`)
      }
      // if not then we need to prompt the user for the answer
      // to this flag
      else {
        // we need to evalutate the default function in this context
        q = Object.assign(q, {default: q.default(flags)})
        // prompt the user and set the answer to the flags variable
        Object.assign(flags, await prompt([q]))
      }

      // run the post processing on the flag values
      if (typeof q.postProcess !== 'undefined') {
        Object.assign(flags, { [name]: q.postProcess(flags[name])})
      }
    }

    // send the flags to the generator
    env.run('wcfactory:init', flags)
  }
}


/**
 * A listing of all prompt questions
 */
const questions: any = [
  {
    type: "string",
    name: "orgNpm",
    message: "NPM organization name (include @)",
    required: true,
    store: true,
    emoji: 'npm',
    default: (flags: any) => {
      return '@' + path.basename(process.cwd())
    },
    postProcess: (value: any) => Case.kebab(value)
  },
  {
    type: "string",
    name: "orgGit",
    message: "Git organization name",
    required: true,
    store: true,
    default: (flags: any) => {
      return flags.orgNpm || path.basename(process.cwd())
    },
    postProcess: (value: any) => Case.kebab(value)
  },
  {
    type: "string",
    name: "name",
    message: "Your Repo name. Must be a valid git/npm name",
    required: true,
    default: (flags: any) => flags.orgNpm || path.basename(process.cwd()),
    postProcess: (value: any) => Case.kebab(value)
  },
  {
    type: "string",
    name: "gitRepo",
    message: "Git repo (full git address)",
    required: true,
    default: (flags: any) => {
      if (flags.name && flags.orgGit) {
        return `git@github.com:${flags.orgGit}/${flags.name}.git`
      }
      else {
        return `git@github.com:${path.basename(process.cwd())}/${path.basename(process.cwd())}.git`
      }
    },
  },
]