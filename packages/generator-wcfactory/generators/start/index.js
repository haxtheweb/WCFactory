const Generator = require("yeoman-generator");
const _ = require("lodash");
const process = require("process");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.props = opts
  }

  writing() {
    this.props.companyDir = process.cwd();
    const prefSave = {
      author: this.props.author,
      copyrightOwner: this.props.copyrightOwner,
      license: this.props.license,
      companyDir: this.props.companyDir,
    }
    this.props.prefString = JSON.stringify(prefSave, null, "  ");
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.templatePath("*/.*"),
      this.destinationPath(),
      this.props,
      { ignore: [".DS_Store"] }
    );
    this.fs.copy(this.templatePath("**/**"), this.destinationPath());
    /**
     * @todo this fails hard
     */
    // this.fs.copyTpl(
    //   this.templatePath(".*"),
    //   this.destinationPath(),
    //   this.props,
    //   { ignore: [".DS_Store"] }
    // );
    // write this to their home directory as well so it can be run more globally
    const homedir = require('os').homedir();
    this.fs.copyTpl(
      this.templatePath(".wcfconfig/*"),
      this.destinationPath(`${homedir}/.wcfconfig/`),
      this.props,
      { ignore: [".DS_Store"] }
    );
    this.fs.copyTpl(
      this.templatePath("_.gitignore"),
      this.destinationPath(`.gitignore`),
      this.props
    );
  }

  install() {
  }

  end() {
    this.spawnCommandSync("git", ["init"]);
    this.spawnCommandSync("git", ["add", "-A"]);
    this.spawnCommandSync("git", [
      "commit",
      "-m",
      `"Initial commit after company started"`
    ]);
  }
};
