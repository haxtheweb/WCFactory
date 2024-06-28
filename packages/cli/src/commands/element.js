const { Command, flags } = require('@oclif/command')
const { promptUser } = require('../utils/commands')
const { questions } = require('../questions/element')
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/element'), 'wcfactory:element')

class Element extends Command {
  async run() {
    let { args, flags } = this.parse(Element)
    // prompt the user for remaining flags
    flags = await promptUser(questions, flags, this)
    // // kick off the generator
    env.run('wcfactory:element', flags)
  }
}

Element.description = 'Create a new element'

/**
 * @todo dynaimically generate this based on the questions const
 */
Element.flags = {
  // global
  help: flags.help({ char: 'h' }),
  factory: flags.string({ char: 'f', description: 'Factory to use' }),
  customElementTemplate: flags.string({ char: 'c', description: 'Custom element template to use' }),
  name: flags.string({ char: 'n', description: 'Name of the element' }),
  description: flags.string({ char: 'd', description: 'Description of the element' }),
  useCLI: flags.boolean({ char: 'l', description: 'Use CLI', allowNo: true }),
  useSass: flags.boolean({ char: 's', description: 'Description of the element', allowNo: true }),
  addProps: flags.boolean({ char: 'p', description: 'Add properties', allowNo: true }),
  useHAX: flags.boolean({ char: 'h', description: 'Use HAX', allowNo: true }),
}

module.exports = Element