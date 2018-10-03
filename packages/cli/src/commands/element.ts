import { Command, flags } from '@oclif/command'
import { promptUser } from '../utils/commands'
import { questions } from '../questions/element'
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
    help: flags.help({ char: 'h' })
  }

  async run() {
    let { args, flags } = this.parse(Element)
    // prompt the user for remaining flags
    flags = await promptUser(questions, flags, this)
    // // kick off the generator
    env.run('wcfactory:app', flags)
  }
}
