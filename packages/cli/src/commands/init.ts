import { Command, flags } from '@oclif/command'
import * as path from 'path'
var inquirer = require('inquirer')
var prompt = inquirer.createPromptModule();
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
// env.register(require.resolve('@wcfactory/generator-wcfactory/generators/init'), 'wcfactory:init')

const questions: any = [
  {
    type: "string",
    name: "orgNpm",
    message: "NPM organization name (include @)",
    required: true,
    store: true,
    default: (flags: any) => {
      return '@' + path.basename(process.cwd())
    }
  },
  {
    type: "string",
    name: "orgGit",
    message: "Git organization name",
    required: true,
    store: true,
    default: (flags: any) => {
      return flags.orgNpm || path.basename(process.cwd())
    }
  },
  {
    type: "string",
    name: "name",
    message: "Your Repo name. Must be a valid git/npm name",
    required: true,
    default: (flags: any) => flags.orgNpm || path.basename(process.cwd())
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
    }
  },
]

export default class Init extends Command {
  static description = 'Create mono repo for your element library. You will only need to do this once.'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    orgNpm: flags.string({ char: 'o', description: 'NPM organization name (include @)' }),
    orgGit: flags.string({ char: 'O', description: 'Git organization name' }),
    name: flags.string({ char: 'n', description: 'Git organization name' }),
    gitRepo: flags.string({ char: 'g', description: 'Your Repo name. Must be a valid git/npm name' }),
  }

  async run() {
    const { args, flags } = this.parse(Init)

    /**
     * A little async iterator :)
     */
    for await (let q of questions) {
      const name = q.name
      if (flags[name]) {
        this.log(`${q.message}: ${flags[name]}`)
      }
      else {
        // we need to evalutate the default function in this context
        q = Object.assign(q, {default: q.default(flags)})
        Object.assign(flags, await prompt([q]))
      }
    }

    // env.run('wcfactory:init', flags)
  }
}
