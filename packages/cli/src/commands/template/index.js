const { Command, flags } = require('@oclif/command')
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/template/update'), 'wcfactory:template:update')

class Template extends Command {
  async run() {
    let { args, flags } = this.parse(Template)
    env.run('wcfactory:template:update', flags)
  }
}

Template.description = 'Manage your companies templates.'

/**
 * @todo dynaimically generate this based on the questions const
 */
Template.flags = {
  // global
  help: flags.help({ char: 'h' })
}

module.exports = Template