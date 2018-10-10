const { Command, flags } = require('@oclif/command')
const { promptUser, getListOptions } = require('../utils/commands')
const { questions } = require('../questions/factory')
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/factory'), 'wcfactory:factory')

class Factory extends Command {
  async run() {
    // process the user input
    let { args, flags } = this.parse(Factory)
    // prompt the user for more info
    flags = await promptUser(questions, flags, this)
    // add a year
    flags.year = new Date().getFullYear()
    // kick off generator
    env.run('wcfactory:factory', flags)
  }
}

Factory.description = 'Create mono repo for your element library.'

/**
 * @todo dynaimically generate this based on the questions const
 */
Factory.flags = {
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

module.exports = Factory
