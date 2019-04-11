const path = require('path')
const { Command, flags } = require('@oclif/command')
const { promptUser } = require('../utils/commands')
const { questions } = require('../questions/operation')
const { runScript } = require('@wcfactory/common')

class Operation extends Command {
  async run() {
    let { args, flags } = this.parse(Operation)
    // prompt the user for remaining flags
    flags = await promptUser(questions, flags, this)
    // run the operation for that element
    runScript(flags.script, flags.element)
  }
}

Operation.description = 'Run a script specified in a package.'

/**
 * @todo dynamically generate this based on the questions const
 */
Operation.flags = {
  // global
  help: flags.help({ char: 'h' }),
  description: flags.string({ char: 'd', description: 'Run the develop command for an element.' }),
}

module.exports = Operation
