const { Command, flags } = require('@oclif/command');
const build = require('@wcfactory/common/unbundled-build.js')
// const { promptUser } = require('../utils/commands')
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/unbundled-build'), 'wcfactory:unbundled-build')

class UnbundledGenerate extends Command {
  async run() {
    let { args, flags } = this.parse(UnbundledGenerate)
    // prompt the user for remaining flags
    // flags = await promptUser(questions, flags, this)
    // kick off the generator
    env.run('wcfactory:unbundled-build', flags)
  }
}

UnbundledGenerate.description = 'Generate an unbundled build project.'

/**
 * @todo dynaimically generate this based on the questions const
 */
UnbundledGenerate.flags = {
  // global
  help: flags.help({ char: 'h' })
}

module.exports = UnbundledGenerate