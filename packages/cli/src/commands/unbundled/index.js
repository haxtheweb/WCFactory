const { Command, flags } = require('@oclif/command')
// const { promptUser } = require('../utils/commands')
// var yeoman = require('yeoman-environment')
// var env = yeoman.createEnv()
// env.register(require.resolve('@wcfactory/generator-wcfactory/generators/unbundled-build'), 'wcfactory:unbundled-build')

class Unbundled extends Command {
  async run() {
    let { args, flags } = this.parse(Unbundled)
    // prompt the user for remaining flags
    // flags = await promptUser(questions, flags, this)
    // kick off the generator
    // env.run('wcfactory:unbundled-build', flags)
  }
}

Unbundled.description = 'Generate Unbundled Builds. A method of packaging web components for production.'

/**
 * @todo dynaimically generate this based on the questions const
 */
Unbundled.flags = {
  // global
  help: flags.help({ char: 'h' })
}

module.exports = Unbundled