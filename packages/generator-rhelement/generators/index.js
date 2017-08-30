const Generator = require('yeoman-generator');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const process = require('process');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your element name'
    }, {
      type: 'input',
      name: 'author',
      message: 'Author name'
    }]).then(answers => {
      let name = answers.name.split('-')[1];

      this.props = {
        author: answers.author,
        name: answers.name,
        elementName: answers.name,
        elementClassName: _.chain(answers.name).camelCase().upperFirst().value(),
        readmeName: _.upperFirst(name),
        lowerCaseName: name
      }

      mkdirp.sync(this.props.elementName);
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(`${this.props.elementName}/package.json`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('element.js'),
      this.destinationPath(`${this.props.elementName}/${this.props.elementName}.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath(`${this.props.elementName}/README.md`),
      this.props
    );

    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath(`${this.props.elementName}/gulpfile.js`)
    );

    this.fs.copy(
      this.templatePath('.*'),
      this.destinationPath(`${this.props.elementName}`)
    );
  }

  install() {
    process.chdir(this.props.elementName);

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }

  end() {
    this.spawnCommand('npm', ['run', 'build']);
    this.spawnCommand('git', ['init']);
  }
};
