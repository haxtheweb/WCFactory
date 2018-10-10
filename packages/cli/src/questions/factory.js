const path = require('path')

/**
 * A listing of all prompt questions
 */
const questions = [
  {
    type: "string",
    name: "humanName",
    message: "Name of this factory",
    required: true,
    store: true,
    default: (flags) => {
      return path.basename(process.cwd())
    }
  },
  {
    type: "string",
    name: "description",
    message: "Description",
    required: true,
    store: true
  },
  {
    type: "string",
    name: "name",
    message: "Repo name (a valid git / npm machine name)",
    required: true,
    default: (flags) => flags.humanName,
    validate: (value) => {
      if (!(/ /gm).test(value)) { return true; }
      return 'can not contain a space';
    }
  },
  {
    type: "string",
    name: "orgNpm",
    message: "NPM organization name (include @)",
    required: true,
    store: true,
    default: (flags) => '@' + flags.name,
    validate: (value) => {
      if (!(/ /gm).test(value)) { return true; }
      return 'can not contain a space';
    }
  },
  {
    type: "string",
    name: "orgGit",
    message: "Git organization name",
    required: true,
    store: true,
    default: (flags) => flags.name.replace('@', ''),
    validate: (value) => {
      if (!(/ /).test(value)) { return true; }
      return 'can not contain a space';
    }
  },
  {
    type: "string",
    name: "gitRepo",
    message: "Git repo (full git address)",
    required: true,
    default: (flags) => `git@github.com:${flags.orgGit}/${flags.name}.git`,
    validate: (value) => {
      if (!(/ /gm).test(value)) { return true; }
      return 'can not contain a space';
    }
  }
]

module.exports.questions = questions