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
      { ignore: ["_*.*"]}
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
      { ignore: ["_*"]}
    );
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(),
      this.props,
      {ignore:["._*"]}
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
    this.spawnCommandSync("git", ["init"]);
    this.spawnCommandSync("git", ["remote", "add", "origin", this.props.gitRepo]);
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
    this.spawnCommandSync("git", ["commit", "-m", `"Initial commit after wcfactory init"`]);
    this.spawnCommandSync("git", ["push", "-u", "origin", "master"]);
  }
};
