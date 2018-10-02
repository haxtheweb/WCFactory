import { Command, flags } from '@oclif/command'
import * as path from 'path'
import { executionAsyncId } from 'async_hooks';
import { spawnSync, spawn } from 'child_process';
var execa = require('execa')
var dargs = require('dargs')
var inquirer = require('inquirer')
var prompt = inquirer.createPromptModule();
var Listr = require('listr')
const UpdaterRenderer = require('listr-update-renderer');
const VerboseRenderer = require('listr-verbose-renderer');
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/init'), 'wcfactory:init')

export default class Init extends Command {
  static description = 'Create mono repo for your element library. You will only need to do this once.'

  /**
   * @todo dynaimically generate this based on the questions const
   */
  static flags = {
    // global
    help: flags.help({ char: 'h' }),
    verbose: flags.boolean({ char: 'v', description: 'Verbose mode' }),
    // specific to this command
    orgNpm: flags.string({ char: 'o', description: 'NPM organization name (include @)' }),
    orgGit: flags.string({ char: 'O', description: 'Git organization name' }),
    name: flags.string({ char: 'n', description: 'Git organization name' }),
    gitRepo: flags.string({ char: 'g', description: 'Your Repo name. Must be a valid git/npm name' }),
  }

  async run() {
    // process the user input
    let { args, flags } = this.parse(Init)
    // prompt the user for the remaining flags
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
        if (typeof q.default !== 'undefined') {
          q = Object.assign(q, { default: q.default(flags) })
        }
        // prompt the user and set the answer to the flags variable
        Object.assign(flags, await prompt([q]))
      }
  
      // run the post processing on the flag values
      if (typeof q.postProcess !== 'undefined') {
        Object.assign(flags, { [name]: q.postProcess(flags[name]) })
      }
    }
    // add a year
    flags.year = new Date().getFullYear()
    // now we are going to assemble a task list
    const listOptions = getListOptions(flags)
    const list = new Listr([
      {
        title: 'Setting up files',
        task: async () => {
          const res = await env.run('wcfactory:init', flags)
        }
      },
      {
        title: 'Initializing Git',
        task: async () => {
          const commands = [
            {
              command: 'git',
              args: ['init']
            },
          ]

          for await (let command of commands) {
            const res = await execa(command.command, command.args)
            if (res.code === 1) {
              throw Error(res.stdout)
            }
          }
        }
      },
      {
        title: 'Installing dependencies',
        task: async () => {
          const commands = [
            {
              command: 'yarn',
              args: ['install']
            },
            {
              command: 'yarn',
              args: ['run', 'init']
            },
            {
              command: 'yarn',
              args: ['run', 'rebuild-wcfacache']
            },
          ]

          for await (let command of commands) {
            const res = await execa(command.command, command.args)
            if (res.code === 1) {
              throw Error(res.stdout)
            }
          }
        }
      },
    ], listOptions)
    // run the list
    list.run();
  }
}


/**
 * A listing of all prompt questions
 */
const questions: any = [
  {
    type: "string",
    name: "humanName",
    message: "Name of this factory",
    required: true,
    store: true,
    default: (flags: any) => {
      return path.basename(process.cwd())
    }
  },
  {
    type: "string",
    name: "description",
    message: "Description",
    required: true,
    store: true
  },
  {
    type: "string",
    name: "name",
    message: "Repo name (a valid git / npm machine name)",
    required: true,
    default: (flags: any) => flags.humanName.trim().replace(' ', '-'),
    postProcess: (value: any) => value.trim().replace(' ', '-')
  },
  {
    type: "string",
    name: "orgNpm",
    message: "NPM organization name (include @)",
    required: true,
    store: true,
    default: (flags: any) => '@' + flags.name,
    postProcess: (value: any) => value.trim().replace(' ', '-')
  },
  {
    type: "string",
    name: "orgGit",
    message: "Git organization name",
    required: true,
    store: true,
    default: (flags: any) => flags.name.replace('@', ''),
    postProcess: (value: any) => value.trim().replace(' ', '-')
  },
  {
    type: "string",
    name: "gitRepo",
    message: "Git repo (full git address)",
    required: true,
    default: (flags: any) => `git@github.com:${flags.orgGit}/${flags.name}.git`
  }
]

/**
 * Generate list options based on flags
 */
const getListOptions = (flags: any) => {
  if (flags.verbose) {
    return {
      renderer: VerboseRenderer,
      collapse: false
    }
  }
  else {
    return {
      renderer: UpdaterRenderer,
      collapse: false
    }
  }
}