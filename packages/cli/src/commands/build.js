const { Command, flags } = require('@oclif/command')
const { promptUser } = require('../utils/commands')
const { questions } = require('../questions/build')
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/build'), 'wcfactory:build')

class Build extends Command {
  async run() {
    let { args, flags } = this.parse(Build)
    // prompt the user for remaining flags
    flags = await promptUser(questions, flags, this)
    // kick off the generator
    env.run('wcfactory:build', flags)
  }
}

Build.description = 'Create a new Build'

/**
 * @todo dynaimically generate this based on the questions const
 */
Build.flags = {
  // global
  help: flags.help({ char: 'h' }),
  name: flags.string({ char: 'n', description: 'Folder name for the build' }),
  description: flags.string({ char: 'd', description: 'Brief description for the build' }),
  factory: flags.string({ char: 'f', description: 'Factory to build from' }),
  buildTarget: flags.string({ char: 't', description: 'Type of build target' }),
}

module.exports = Build