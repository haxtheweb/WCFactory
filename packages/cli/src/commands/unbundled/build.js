const { Command, flags } = require('@oclif/command');
const build = require('@wcfactory/common/unbundled-build.js')

class UnbundledBuild extends Command {
  async run() {
    let { args, flags } = this.parse(UnbundledBuild)
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