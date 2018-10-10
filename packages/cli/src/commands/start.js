const { Command, flags } = require('@oclif/command')
const { questions } = require('../questions/start')
const { promptUser } = require('../utils/commands')
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/start'), 'wcfactory:start')

class Start extends Command {
  async run() {
    const { args, flags } = this.parse(Start)
    // prompt user for remaining flags
    Object.assign(flags, await promptUser(questions, flags, this))
    // call the generator
    env.run('wcfactory:start', flags)
  }
}

Start.description = 'Create a company for your factories.'

Start.flags = {
  help: flags.help({ char: 'h' }),
  author: flags.string({ char: 'a', description: 'Author name for your elements' }),
  copyrightOwner: flags.string({ char: 'c', description: 'Copyright owner of your work' }),
  license: flags.enum({
    char: 'l',
    description: 'Software License to use',
    options: ["Apache-2.0", "MIT", "BSD-3-Clause", "BSD-2-Clause"]
  })
}

module.exports = Start