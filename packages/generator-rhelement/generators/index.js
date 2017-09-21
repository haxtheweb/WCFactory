const Generator = require('yeoman-generator');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const process = require('process');
const packageJson = require('../package.json');

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
    }, {
      type: 'list',
      name: 'useSass',
      message: 'Do you want to use Sass with this element?',
      choices: [{
        name: 'Yes',
        value: true
      }, {
        name: 'No',
        value: false
      }]
    }, {
      type: 'list',
      name: 'sassLibrary',
      when: answers => {
        return answers.useSass;
      },
      message: 'Do want to use existing Sass dependencies?',
      choices: [{
        name: 'cp-sass',
        value: {
          pkg: '@rhelements/cp-sass',
          path: '@rhelements/cp-sass/cp-sass'
        }
      }, {
        name: 'No thanks. I\'ll provide my own later',
        value: null
      }]
    }]).then(answers => {
      let name = answers.name.split('-')[1];

      this.props = {
        author: answers.author,
        name: answers.name,
        elementName: answers.name,
        elementClassName: _.chain(answers.name).camelCase().upperFirst().value(),
        readmeName: _.upperFirst(name),
        lowerCaseName: name,
        useSass: answers.useSass,
        sassLibraryPkg: answers.sassLibrary.pkg || false,
        sassLibraryPath: answers.sassLibrary.path || false,
        generatorRhelementVersion: packageJson.version
      };

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

    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath(`${this.props.elementName}/gulpfile.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('demo/index.html'),
      this.destinationPath(`${this.props.elementName}/demo/index.html`),
      this.props
    );

    this.fs.copy(
      this.templatePath('.*'),
      this.destinationPath(`${this.props.elementName}`)
    );

    if (this.props.useSass) {
      this.fs.copyTpl(
        this.templatePath('base.scss'),
        this.destinationPath(`${this.props.elementName}/${this.props.elementName}.scss`),
        this.props
      );
    }
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
