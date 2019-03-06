const { Command, flags } = require('@oclif/command')
const { spawn } = require('child_process');
const path = require('path')
const uiLocation = require.resolve('@wcfactory/ui')
const serverLocation = require.resolve('@wcfactory/graphql-server')

class UI extends Command {
  async run() {
    let { args, flags } = this.parse(UI)
    /**
     * @todo we should probably move these into a startup
     * script somewhere else.
     */
    // start up the UI
    spawn('npm', ['run', 'start:build'], {
      cwd: path.dirname(uiLocation),
      stdio: 'inherit',
      shell: true
    });
    // start up the Graphql server
    spawn('npm', ['run', 'start'], {
      cwd: path.dirname(serverLocation),
      stdio: 'inherit',
      shell: true
    });
  }
}

UI.description = 'Start up the visual user interface for WCFactory.'

/**
 * @todo dynaimically generate this based on the questions const
 */
UI.flags = {
  help: flags.help({ char: 'h' }),
  description: flags.string({ char: 'd', description: UI.description })
}

module.exports = UI