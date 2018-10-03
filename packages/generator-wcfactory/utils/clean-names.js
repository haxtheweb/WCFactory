var validate = require("validate-npm-package-name");

/**
 * Validate npm package names that will be used
 * to name the meta repository
 */
const repoNameValidate = name => {
  return validate(name);
};
module.exports.repoNameValidate = repoNameValidate;
