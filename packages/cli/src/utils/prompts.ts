var inquirer = require('inquirer')
var prompt = inquirer.createPromptModule();

/**
 * Takes flags from the cli and converts them into prompts
 * @param questions 
 * @param flags 
 * @param ctx context 
 */
export const promptUser = async (questions: any, flags: any, ctx: any) => {
  // prompt the user for the remaining flags
  for await (let q of questions) {
    // get the name of the question
    const name = q.name
    // if the user already answered this flag then
    // log it out and skip it
    if (flags[name]) {
      ctx.log(`${q.message}: ${flags[name]}`)
    }
    // if not then we need to prompt the user for the answer
    // to this flag
    else {
      // we need to evalutate the default function in this context
      if (typeof q.default !== 'undefined') {
        q = Object.assign(q, { default: q.default(flags) })
      }
      // prompt the user and set the answer to the flags variable
      Object.assign(flags, await prompt([q]))
    }

    // run the post processing on the flag values
    if (typeof q.postProcess !== 'undefined') {
      Object.assign(flags, { [name]: q.postProcess(flags[name]) })
    }
  }

  return flags
}