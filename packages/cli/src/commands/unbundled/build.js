const { Command, flags } = require('@oclif/command');
const build = require('@wcfactory/common/unbundled-build.js')
// const { promptUser } = require('../utils/commands')
// var yeoman = require('yeoman-environment')
// var env = yeoman.createEnv()
// env.register(require.resolve('@wcfactory/generator-wcfactory/generators/unbundled-build'), 'wcfactory:unbundled-build')

class UnbundledBuild extends Command {
  async run() {
    let { args, flags } = this.parse(UnbundledBuild)
    // prompt the user for remaining flags
    // flags = await promptUser(questions, flags, this)
    // kick off the generator
    // env.run('wcfactory:unbundled-build', flags)
    build();
  }
}

UnbundledBuild.description = 'Build a project.'

/**
 * @todo dynaimically generate this based on the questions const
 */
UnbundledBuild.flags = {
  // global
  help: flags.help({ char: 'h' })
}

module.exports = UnbundledBuild