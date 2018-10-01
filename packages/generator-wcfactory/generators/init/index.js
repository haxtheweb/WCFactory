const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");

const packageJson = require("../../package.json");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.props = opts
  }

  writing() {
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.templatePath('*/**'),
      this.destinationPath(),
      this.props,
      { ignore: ["_*.*"] }
    );
    this.fs.copyTpl(
      this.templatePath('*/.*'),
      this.destinationPath(),
      this.props,
      { ignore: ["_*.*"] }
    );
    this.fs.copyTpl(
      this.templatePath('*'),
      this.destinationPath(),
      this.props,
      { ignore: ["_*"] }
    );
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(),
      this.props,
      { ignore: ["._*"] }
    );
    this.fs.copyTpl(
      this.templatePath('.*/**'),
      this.destinationPath(),
      this.props,
      { ignore: ["._*"] }
    );
    this.fs.copy(
      this.templatePath("../wcfTemplates/libraries/**"),
      this.destinationPath("wcfLibraries/")
    );
    this.fs.copy(
      this.templatePath("../wcfTemplates/buildTargets/**"),
      this.destinationPath("wcfBuildTargets/")
    );
  }

  install() {
  }

  end() {
  }
};
