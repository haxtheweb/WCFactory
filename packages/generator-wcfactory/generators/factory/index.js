const { userConfig } = require('@wcfactory/common/config')
const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const process = require("process");
const fs = require("fs");
const {fixDotfiles} = require('../../utils/fix-dotfiles');
const { spawn } = require('child_process')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.props = opts
  }

  writing() {
    process.chdir(userConfig.companyDir);
    mkdirp.sync(`factories/${this.props.name}`);

    this.destinationRoot(`factories/${this.props.name}`);

    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.templatePath("*/**"),
      this.destinationPath(),
      this.props,
      { ignore: ["_*.*"] }
    );
    this.fs.copyTpl(
      this.templatePath("*/.*"),
      this.destinationPath(),
      this.props,
      { ignore: ["_*.*"] }
    );
    this.fs.copyTpl(
      this.templatePath("*"),
      this.destinationPath(),
      this.props,
      { ignore: ["_*"] }
    );
    this.fs.copyTpl(
      this.templatePath(".*"),
      this.destinationPath(),
      this.props,
      { ignore: ["._*"] }
    );
    this.fs.copyTpl(
      this.templatePath(".*/**"),
      this.destinationPath(),
      this.props,
      { ignore: ["._*"] }
    );
    fixDotfiles(this);
  }

  install() {
    fs.renameSync('./storybook', './.storybook');
    this.spawnCommandSync("git", ["init"]);
    this.spawnCommandSync("git", [
      "remote",
      "add",
      "origin",
      this.props.gitRepo
    ]);
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }

  end() {
    this.spawnCommandSync("yarn", ["run", "init"]);
    this.spawnCommandSync("yarn", ["run", "rebuild-wcfcache"]);
    this.spawnCommandSync("git", ["add", "-A"]);
    this.spawnCommandSync("git", [
      "commit",
      "-m",
      `"Initial commit after wcfactory init"`
    ]);
  }
};
