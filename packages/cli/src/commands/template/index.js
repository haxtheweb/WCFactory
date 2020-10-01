const { Command, flags } = require('@oclif/command')

class Template extends Command {
  async run() {
    let { args, flags } = this.parse(Template)
    console.log(`You must specify template:update`)
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