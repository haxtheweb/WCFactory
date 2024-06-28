const { Command, flags } = require('@oclif/command')
var yeoman = require('yeoman-environment')
var env = yeoman.createEnv()
env.register(require.resolve('@wcfactory/generator-wcfactory/generators/template/update'), 'wcfactory:template:update')

class TemplateUpdate extends Command {
  async run() {
    let { args, flags } = this.parse(TemplateUpdate)
    env.run('wcfactory:template:update', flags)
  }
}

TemplateUpdate.description = 'Update the default templates directory in your company store.'

/**
 * @todo dynamically generate this based on the questions const
 */
TemplateUpdate.flags = {
  // global
  help: flags.help({ char: 'h' })
}

module.exports = TemplateUpdate