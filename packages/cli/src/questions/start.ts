var os = require("os");

export const questions = [
  {
    type: "input",
    name: "author",
    message: "Author name for your elements",
    store: true,
    default: os.userInfo().username
  },
  {
    type: "input",
    name: "copyrightOwner",
    message: "Copyright owner of your work",
    store: true
  },
  {
    type: "list",
    name: "license",
    message: "Software License to use",
    store: true,
    default: "apache2",
    choices: [
      {
        name: "Apache 2.0",
        value: "Apache-2.0"
      },
      {
        name: "MIT",
        value: "MIT"
      },
      {
        name: "BSD 3-clause",
        value: "BSD-3-Clause"
      },
      {
        name: "BSD 2-clause",
        value: "BSD-2-Clause"
      }
    ]
  }
]