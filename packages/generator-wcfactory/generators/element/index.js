const { config, libraries } = require('@wcfactory/common/config')
const Generator = require("yeoman-generator");
const _ = require("lodash");
const path = require("path");
const mkdirp = require("mkdirp");
const chalk = require("chalk");
const process = require("process");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.answers = opts
  }

  writing() {
    const dir = path.join(path.dirname(__filename), "../", "../");
    const operationJson = require(`${dir}/package.json`);
    // move to the company to write relative to here
    const packageJson = require(`${this.answers.factory}/package.json`);
    const lernaJson = require(`${this.answers.factory}/lerna.json`);
    // ensure answer is in kebabcase and lowercase
    this.answers.name = _.kebabCase(this.answers.name).toLowerCase();
    let name = this.answers.name.split("-")[1];
    this.capitalizeFirstLetter = (string) => {
      return string[0].toUpperCase() + string.slice(1);
    };
    this.props = {
      factory: this.answers.factory,
      year: new Date().getFullYear(),
      orgNpm: packageJson.wcfactory.orgNpm,
      monorepo: packageJson.wcfactory.monorepo,
      orgGit: packageJson.wcfactory.orgGit,
      gitRepo: packageJson.wcfactory.gitRepo,
      author: config.author,
      copyrightOwner: config.copyrightOwner,
      license: config.license,
      name: this.answers.name,
      humanName: this.capitalizeFirstLetter(this.answers.name.replace('-', ' ')),
      description: this.answers.description,
      elementName: this.answers.name,
      addProps: this.answers.addProps,
      propsListRaw: this.answers.propsList,
      includesString: '',
      connectedString: '',
      constructorString: '',
      additionalFunctionsString: '',
      propsList: {},
      propsListString: '',
      useHAX: this.answers.useHAX,
      haxList: {},
      haxListString: '',
      propsBindingFactory: '',
      customElementClass: libraries[this.answers.customElementTemplate].wcfactory.customElementClass,
      activeWCFLibrary: libraries[this.answers.customElementTemplate],
      elementClassName: _.chain(this.answers.name)
        .camelCase()
        .upperFirst()
        .value(),
      readmeName: _.upperFirst(name),
      storyGroup: _.upperFirst(name),
      lowerCaseName: name,
      camelCaseName: _.camelCase(this.answers.name),
      useSass: this.answers.useSass,
      sassLibraryPkg: false,
      sassLibraryPath: false,
      libraryScripts: '',
      libraryDevDependencies: '',
      libraryDependencies: '',
      generatorWCFactoryVersion: operationJson.version,
      version: lernaJson.version
    };
    _.forEach(this.props.propsListRaw, (prop) => {
      if (prop.observer) {
        prop.observer = '_' + prop.name + 'Changed';
      }
      this.props.propsList[prop.name] = prop;
    });
    this.props.propsListString = JSON.stringify(this.props.propsList, null, '  ')
    // work on HAX integration if requested
    if (this.props.useHAX) {
      // include statement for top of files
      this.props.includesString += 'import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"';
      // package dependency
      this.props.libraryDependencies += `"@lrnwebcomponents/hax-body-behaviors":"latest",`;
      // load props in from this dynamically generated function call
      this.props.connectedString = 'this.HAXWiring = new HAXWiring();' + "\n" + '    this.HAXWiring.setup(' + this.props.elementClassName + '.haxProperties, ' + this.props.elementClassName + '.tag, this);';
      // set baseline for HAX schema
      this.props.haxList = {
        'canScale': true,
        'canPosition': true,
        'canEditSource': false,
        'gizmo': {
          'title': this.props.humanName,
          'description': this.props.description,
          'icon': 'icons:android',
          'color': 'green',
          'groups': [this.props.readmeName],
          'handles': [
            {
              'type': 'todo:read-the-docs-for-usage',
            }
          ],
          'meta': {
            'author': this.props.author,
            'owner': this.props.copyrightOwner,
          }
        },
        'settings': {
          'quick': [],
          'configure': [],
          'advanced': []
        }
      };
      // wire HAX properties into the configure block by default
      _.forEach(this.props.propsListRaw, (prop) => {
        let method = 'textfield';
        let icon = 'icons:android';
        // attempt to map data type to hax inputMethod
        switch (prop.type) {
          case 'Boolean':
          case 'Array':
            method = prop.type.toLowerCase();
            break;
          case 'Object':
            method = 'array';
            break;
          case 'Date':
            method = 'datepicker';
            icon = 'icons:date-range';
            break;
        }
        let config = {
          property: prop.name,
          title: prop.humanName,
          description: '',
          inputMethod: method,
          required: false,
          icon: icon,
        };
        // guess a bit for decent starting points on some common ones we see all the time
        if (prop.name === 'source' || prop.name === 'src' || prop.name === 'url') {
          config.validationType = 'url';
          config.required = true;
          config.icon = 'icons:link';
          // make this quickly available
          this.props.haxList.settings.quick.push(config);
        }
        else if (prop.name === 'alt') {
          config.inputMethod = 'alt';
          config.required = true;
          config.icon = 'icons:accessibility';
          // make this quickly available
          this.props.haxList.settings.quick.push(config);
        }
        else if (prop.name === 'color' || prop.name === 'primaryColor' || prop.name === 'accentColor') {
          if (config.type === 'textfield') {
            config.inputMethod = 'colorpicker';
            config.icon = 'editor:format-color-fill';
            // make this quickly available by default
            this.props.haxList.settings.quick.push(config);
          }
        }
        this.props.haxList.settings.configure.push(config);
      });
    }
    else {
      this.props.useHAX = false;
    }
    // convert to string so we can write to the {name}-hax.json file
    this.props.haxListString = JSON.stringify(this.props.haxList, null, '  ')
    // step through the active package.json file and grab the pieces we most directly need
    this.props.templateReturnFunctionPart = this.props.activeWCFLibrary.wcfactory.templateReturnFunctionPart;
    // work on scripts
    for (var scriptName in this.props.activeWCFLibrary.scripts) {
      let scriptContents = this.props.activeWCFLibrary.scripts[scriptName].replace(new RegExp('"', 'g'), '\\\"');
      this.props.libraryScripts += `"${scriptName}":"${scriptContents}",`;
    }
    // trim that last , if needed
    if (this.props.libraryScripts !== '') {
      this.props.libraryScripts = this.props.libraryScripts.slice(0, -1);
    }
    // work on devDependencies
    _.forEach(this.props.activeWCFLibrary.devDependencies, (version, dependency) => {
      this.props.libraryDevDependencies += `"${dependency}":"${version}",`;
    });
    // trim that last , if needed
    if (this.props.libraryDevDependencies !== '') {
      this.props.libraryDevDependencies = this.props.libraryDevDependencies.slice(0, -1);
    }
    // work on dependencies
    _.forEach(this.props.activeWCFLibrary.dependencies, (version, dependency) => {
      this.props.libraryDependencies += `"${dependency}":"${version}",`;
    });
    // trim that last , if needed
    if (this.props.libraryDependencies !== '') {
      this.props.libraryDependencies = this.props.libraryDependencies.slice(0, -1);
    }
    if (this.props.activeWCFLibrary.wcfactory.propertyBinding) {
      _.forEach(this.props.propsListRaw, (prop) => {
        this.props.propsBindingFactory += '<div>' + this.props.activeWCFLibrary.wcfactory.propertyBinding.prefix + prop.name + this.props.activeWCFLibrary.wcfactory.propertyBinding.suffix + '</div>' + "\n";
      });
    }
    _.forEach(this.props.propsListRaw, (prop) => {
      // convert to object so we can build functions
      if (prop.observer) {
        this.props.additionalFunctionsString += `  // Observer ${prop.name} for changes
              _${prop.name}Changed (newValue, oldValue) {
                if (typeof newValue !== typeof undefined) {
                  console.log(newValue);
                }
              }` + "\n\n";
      }
    });
    if (this.answers.useSass) {
      if (this.answers.sassLibrary && this.answers.sassLibrary.pkg) {
        this.props.sassLibraryPkg = this.answers.sassLibrary.pkg;
      }

      if (this.answers.sassLibrary && this.answers.sassLibrary.path) {
        this.props.sassLibraryPath = this.answers.sassLibrary.path;
      }
      if (this.props.libraryDependencies === '') {
        this.props.libraryDependencies = `"${this.answers.sassLibrary.pkg}":"*"`;
      }
      else {
        this.props.libraryDependencies += `,"${this.answers.sassLibrary.pkg}":"*"`;
      }
    }
    // create element directory
    mkdirp.sync(`${this.props.factory}/elements/${this.props.elementName}`);
    // transition into that directory
    this.destinationRoot(`${this.props.factory}/elements/`);
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath(`${this.props.elementName}/package.json`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath(`${this.props.elementName}/index.html`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath(`licenses/${this.props.license}.md`),
      this.destinationPath(`${this.props.elementName}/LICENSE.md`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath(`src/properties.json`),
      this.destinationPath(
        `${this.props.elementName}/src/${
          this.props.elementName
        }-properties.json`
      ),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(`src/hax.json`),
      this.destinationPath(
        `${this.props.elementName}/src/${this.props.elementName}-hax.json`
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath(`${this.props.elementName}/README.md`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("gulpfile.js"),
      this.destinationPath(`${this.props.elementName}/gulpfile.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("rollup.config.js"),
      this.destinationPath(`${this.props.elementName}/rollup.config.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("demo/index.html"),
      this.destinationPath(`${this.props.elementName}/demo/index.html`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("test/element_test.html"),
      this.destinationPath(
        `${this.props.elementName}/test/${this.props.elementName}_test.html`
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("test/index.html"),
      this.destinationPath(`${this.props.elementName}/test/index.html`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("element.story.js"),
      this.destinationPath(
        `${this.props.elementName}/${this.props.elementName}.story.js`
      ),
      this.props
    );

    this.fs.copy(
      this.templatePath(".*"),
      this.destinationPath(`${this.props.elementName}`)
    );

    this.fs.copy(
      this.templatePath("polymer.json"),
      this.destinationPath(`${this.props.elementName}/polymer.json`)
    );

    if (this.props.useSass) {
      this.fs.copyTpl(
        this.templatePath("src/element.scss"),
        this.destinationPath(
          `${this.props.elementName}/src/${this.props.elementName}.scss`
        ),
        this.props
      );
    } else {
      this.fs.copy(
        this.templatePath("src/element.css"),
        this.destinationPath(
          `${this.props.elementName}/src/${this.props.elementName}.css`
        )
      );
    }

    this.fs.copyTpl(
      this.templatePath("src/element.html"),
      this.destinationPath(
        `${this.props.elementName}/src/${this.props.elementName}.html`
      ),
      this.props
    );

    this.fs.copyTpl(
      this.sourceRoot(
        `../../../templates/libraries/${this.props.activeWCFLibrary.main}`
      ),
      this.destinationPath(
        `${this.props.elementName}/src/${this.props.elementName}.js`
      ),
      this.props
    );
  }

  install() {
    process.chdir(`${this.props.factory}`);
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }

  end() {
    process.chdir(`${this.props.factory}/elements/${this.props.elementName}`);
    this.spawnCommandSync("yarn", ["run", "build"]);
    let banner =
      chalk.green("\n    A fresh made ") +
      chalk.yellow("Web Component Factory ") +
      chalk.green("element brought to you by:\n        ") +
      chalk.blue("The Pennsylvania ") +
      chalk.white("State University's ") +
      chalk.magenta("E") +
      chalk.cyan("L") +
      chalk.red("M") +
      chalk.yellow("S") +
      chalk.white(": ") +
      chalk.green("Learning Network\n")
    banner +=
      chalk.green("\n\nTo work on your new element type:\n    ") +
      chalk.yellow(
        `cd ${this.props.factory}/elements/${this.props.elementName} && yarn start\n\n`
      );
    this.log(banner);
  }
};