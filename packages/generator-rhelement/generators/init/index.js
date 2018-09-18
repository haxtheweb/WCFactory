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
    ]).then(answers => {
      let name = answers.name.split("-")[1]
      this.props = {
        name: answers.name
      }
    })
  }

  writing() {
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.templatePath('*/*'),
      this.destinationPath(),
      this.props,
      {ignore:["_*.*"]}
    );
    this.fs.copyTpl(
      this.templatePath('*'),
      this.destinationPath(),
      this.props,
      {ignore:["_*"]}
    );
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(),
      this.props,
      {ignore:["._*"]}
    );
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }

  end() {
    this.spawnCommand("npm", ["run", "init"]);
  }
};
