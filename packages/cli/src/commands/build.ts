import { Command, flags } from '@oclif/command'
import { promptUser } from '../utils/commands'
import { questions } from '../questions/build'
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/build'), 'wcfactory:build')

export default class Build extends Command {
  static description = 'Create a new Build'

  /**
   * @todo dynaimically generate this based on the questions const
   */
  static flags = {
    // global
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'Folder name for the build'}),
    description: flags.string({ char: 'd', description: 'Brief description for the build'}),
    factory: flags.string({ char: 'f', description: 'Factory to build from'}),
    buildTarget: flags.string({ char: 't', description: 'Type of build target'}),
  }

  async run() {
    let { args, flags } = this.parse(Build)
    // prompt the user for remaining flags
    flags = await promptUser(questions, flags, this)
    // kick off the generator
    env.run('wcfactory:build', flags)
  }
}
