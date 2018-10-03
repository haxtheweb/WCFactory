import { Command, flags } from '@oclif/command'
import { promptUser, getListOptions } from '../utils/commands'
import { questions } from '../questions/init'
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
    humanName: flags.string({ char: 'h', description: 'Name of this factory' }),
    description: flags.string({ char: 'd', description: 'Description of this factory' }),
    orgNpm: flags.string({ char: 'o', description: 'NPM organization name (include @)' }),
    orgGit: flags.string({ char: 'O', description: 'Git organization name' }),
    name: flags.string({ char: 'n', description: 'Git organization name' }),
    gitRepo: flags.string({ char: 'g', description: 'Your Repo name. Must be a valid git/npm name' }),
  }

  async run() {
    // process the user input
    let { args, flags } = this.parse(Init)
    // prompt the user for more info
    flags = await promptUser(questions, flags, this)
    // add a year
    flags.year = new Date().getFullYear()
    // kick off generator
    env.run('wcfactory:init', flags)
  }
}
