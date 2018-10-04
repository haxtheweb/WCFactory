const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.props = opts
  }

  writing() {
    this.props.prefString = JSON.stringify(this.props, null, "  ");
    console.log(this.props)
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
    this.fs.copyTpl(
      this.templatePath(".wcfconfig/*"),
      this.destinationPath(".wcfconfig/"),
      this.props,
      { ignore: [".DS_Store"] }
    );
  }

  install() {}

  end() {}
};
