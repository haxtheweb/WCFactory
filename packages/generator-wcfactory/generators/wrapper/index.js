const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");

const packageJson = require("../../package.json");

module.exports = class extends Generator {
  // constructor(args, opts) {
  //   super(args, opts)

  //   this.argument('name', {type: String, required: true})
  // }

  prompting() {
    return this.prompt([
      
    ]).then(answers => {
      this.props = {
      }
    })
  }

  writing() {
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.templatePath('*/.*'),
      this.destinationPath(),
      this.props,
    );
    this.fs.copyTpl(
      this.templatePath('*/*/.*'),
      this.destinationPath(),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.*/.*'),
      this.destinationPath(),
      this.props
    );
  }

  install() {
  }

  end() {
  }
};
