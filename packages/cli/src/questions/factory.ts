const path = require('path')

/**
 * A listing of all prompt questions
 */
export const questions: any = [
  {
    type: "string",
    name: "humanName",
    message: "Name of this factory",
    required: true,
    store: true,
    default: (flags: any) => {
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
    default: (flags: any) => flags.humanName,
    validate: (value: any) => {
      if ((/([a-z]*)-([a-z]*)/).test(value)) { return true; }
      return 'name requires a hyphen and all lowercase';
    }
  },
  {
    type: "string",
    name: "orgNpm",
    message: "NPM organization name (include @)",
    required: true,
    store: true,
    default: (flags: any) => '@' + flags.name,
    validate: (value: any) => {
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
    default: (flags: any) => flags.name.replace('@', ''),
    validate: (value: any) => {
      if (!(/ /).test(value)) { return true; }
      return 'can not contain a space';
    }
  },
  {
    type: "string",
    name: "gitRepo",
    message: "Git repo (full git address)",
    required: true,
    default: (flags: any) => `git@github.com:${flags.orgGit}/${flags.name}.git`
  }
]