import { Command, flags } from '@oclif/command'
import { questions } from '../questions/start'
import { promptUser } from '../utils/commands'
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/start'), 'wcfactory:start')

export default class Start extends Command {
  static description = 'Create a conglomerate for your factories.'

  static flags = {
    help: flags.help({ char: 'h' }),
    author: flags.string({ char: 'a', description: 'Author name for your elements' }),
    copyrightOwner: flags.string({ char: 'c', description: 'Copyright owner of your work' }),
    license: flags.enum({
      char: 'l',
      description: 'Software License to use',
      options: ["Apache 2.0", "MIT", "BSD 3-clause", "BSD 2-clause"]
    })
  }

  async run() {
    const { args, flags } = this.parse(Start)
    // prompt user for remaining flags
    Object.assign(flags, await promptUser(questions, flags, this))
    // call the generator
    env.run('wcfactory:start', flags)
  }
}
