import { Command, flags } from '@oclif/command'
import { promptUser } from '../utils/commands'
import { questions } from '../questions/element'
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/element'), 'wcfactory:element')

export default class Element extends Command {
  static description = 'Create a new element'

  /**
   * @todo dynaimically generate this based on the questions const
   */
  static flags = {
    // global
    help: flags.help({ char: 'h' }),
    factory: flags.string({ char: 'f', description: 'Factory to use' }),
    customElementTemplate: flags.string({ char: 'c', description: 'Custom element template to use' }),
    name: flags.string({ char: 'n', description: 'Name of the element' }),
    description: flags.string({ char: 'd', description: 'Description of the element' }),
    useSass: flags.boolean({ char: 's', description: 'Description of the element', allowNo: true }),
    addProps: flags.boolean({ char: 'p', description: 'Add properties', allowNo: true }),
    useHAX: flags.boolean({ char: 'h', description: 'Use HAX', allowNo: true }),
  }

  async run() {
    let { args, flags } = this.parse(Element)
    // prompt the user for remaining flags
    flags = await promptUser(questions, flags, this)
    // // kick off the generator
    env.run('wcfactory:element', flags)
  }
}
