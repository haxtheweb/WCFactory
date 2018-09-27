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
        name: "name",
        message: "Your Repo name. Must be a valid npm name format.",
        required: true,
        default: path.basename(process.cwd())
      },
      {
        type: "string",
        name: "org",
        message: "NPM Organization name (without @)",
        required: true,
        default: path.basename(process.cwd())
      },
      {
        type: "string",
        name: "gitRepo",
        message: "Git repo to power this",
        required: true,
        default: `git@github.com:` + path.basename(process.cwd()) + `/` + path.basename(process.cwd()) + `.git`
      },
    ]).then(answers => {
      let name = answers.name.split("-")[1]
      this.props = {
        name: answers.name,
        org: answers.org,
        gitRepo: answers.gitRepo
      }
    })
  }

  writing() {
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.templatePath('*/*'),
      this.destinationPath(),
      this.props,
      { ignore: ["_*.*", "wcfLibraries/**", "wcfBuildTargets/**"]}
    );
    this.fs.copyTpl(
      this.templatePath('*'),
      this.destinationPath(),
      this.props,
      { ignore: ["_*", "wcfLibraries", "wcfBuildTargets"]}
    );
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(),
      this.props,
      {ignore:["._*"]}
    );
    this.fs.copy(
      this.templatePath("wcfLibraries/**"),
      this.destinationPath("wcfLibraries/")
    );
    this.fs.copy(
      this.templatePath("wcfBuildTargets/**"),
      this.destinationPath("wcfBuildTargets/")
    );
  }

  install() {
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }

  end() {
    this.spawnCommand("git", ["init"]);
    this.spawnCommand("git", ["remote", "add", "origin", this.props.gitRepo]);
    this.spawnCommand("yarn", ["run", "init"]);
    this.spawnCommand("git", ["add", "-A"]);
    this.spawnCommand("git", ["commit", "-m", `"Initial commit after wcfactory init"`]);
    this.spawnCommand("git", ["push", "-u", "origin", "master"]);
  }
};
