const Generator = require("yeoman-generator");
const path = require("path");
const { userConfig } = require("@wcfactory/common/config");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.props = opts;
  }
  writing() {
    // copy all files that don't start with an underscore
    this.fs.copy(
      path.join(__dirname, `../../start/templates/templates`),
      path.join(userConfig.companyDir, `templates`)
    );
  }
};
