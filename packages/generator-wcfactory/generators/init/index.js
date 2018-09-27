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
      {
        type: "string",
        name: "orgNpm",
        message: "NPM organization name (include @)",
        required: true,
        store: true,
        default: '@' + path.basename(process.cwd())
      },
      {
        type: "string",
        name: "orgGit",
        message: "Git organization name",
        required: true,
        store: true,
        default: path.basename(process.cwd())
      },
      {
        type: "string",
        name: "name",
        message: "Your Repo name. Must be a valid git/npm name",
        required: true,
        default: path.basename(process.cwd())
      },
      {
        type: "string",
        name: "gitRepo",
        message: "Git repo (full git address)",
        required: true,
        default: `git@github.com:` + path.basename(process.cwd()) + `/` + path.basename(process.cwd()) + `.git`
      },
    ]).then(answers => {
      let name = answers.name.split("-")[1]
      this.props = {
        name: answers.name,
        orgNpm: answers.orgNpm,
        orgGit: answers.orgGit,
        gitRepo: answers.gitRepo,
        year: new Date().getFullYear(),
      }
    })
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
