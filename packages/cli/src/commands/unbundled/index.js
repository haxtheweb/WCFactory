const { Command, flags } = require('@oclif/command')

class Unbundled extends Command {
  async run() {
    let { args, flags } = this.parse(Unbundled)
    console.log(`You must specify either unbundled:generate or unbundled:build`)
  }
}

Unbundled.description = '[In Development] Generate Unbundled Builds. A method of packaging web components for production.'

/**
 * @todo dynaimically generate this based on the questions const
 */
Unbundled.flags = {
  // global
  help: flags.help({ char: 'h' })
}

module.exports = Unbundled