const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");
module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "string",
        name: "humanName",
        message: "Name of this factory",
        required: true,
        store: true,
        default: "@" + path.basename(process.cwd())
      },
      {
        type: "string",
        name: "description",
        message: "Description",
        required: true,
        store: true,
        default: "@" + path.basename(process.cwd())
      },
      {
        type: "string",
        name: "name",
        message: "Repo name (a valid git / npm machine name)",
        required: true,
        default: path.basename(process.cwd())
      },
      {
        type: "string",
        name: "orgNpm",
        message: "NPM organization name (include @)",
        required: true,
        store: true,
        default: "@" + path.basename(process.cwd())
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
        name: "gitRepo",
        message: "Git repo (full git address)",
        required: true,
        default:
          `git@github.com:` +
          path.basename(process.cwd()) +
          `/` +
          path.basename(process.cwd()) +
          `.git`
      }
    ]).then(answers => {
      let name = answers.name.split("-")[1];
      this.props = {
        name: answers.name,
        humanName: answers.humanName,
        description: answers.description,
        orgNpm: answers.orgNpm,
        orgGit: answers.orgGit,
        gitRepo: answers.gitRepo,
        year: new Date().getFullYear()
      };
    });
  }

  writing() {
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
  }

  install() {
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
