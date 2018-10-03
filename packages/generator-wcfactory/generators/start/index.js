const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");
var os = require("os");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
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
    ]).then(answers => {
      this.props = {
        author: answers.author,
        copyrightOwner: answers.copyrightOwner,
        license: answers.license
      };
      this.props.prefString = JSON.stringify(this.props, null, "  ");
    });
  }

  writing() {
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.templatePath("*/.*"),
      this.destinationPath(),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("*/*/.*"),
      this.destinationPath(),
      this.props
    );
    this.fs.copy(this.templatePath("**/**"), this.destinationPath());
    this.fs.copyTpl(
      this.templatePath(".*"),
      this.destinationPath(),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".wcfconfig/*"),
      this.destinationPath(".wcfconfig/"),
      this.props
    );
  }

  install() {}

  end() {}
};
