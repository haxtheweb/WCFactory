const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.props = opts
  }

  writing() {
    // copy all files that don't start with an underscore
    this.fs.copy(this.templatePath("**/**"), this.destinationPath());
  }

  install() {
  }

  end() {
  }
};
