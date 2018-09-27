const Generator = require("yeoman-generator");
const recursive = require('inquirer-recursive');
const _ = require("lodash");
const mkdirp = require("mkdirp");
const fs = require('fs');
const process = require("process");
const cwd = process.cwd();
const packageJson = require(`${cwd}/package.json`);
const elementsDirectory = `${cwd}/elements/`;
const wcfLibrariesCache = JSON.parse(fs.readFileSync(`${cwd}/.wcflibcache.json`, 'utf8'));
var wcfLibraries = {};
module.exports = class extends Generator {
  initializing() {
    this.env.adapter.promptModule.registerPrompt('recursive', recursive);
  }
  prompting() {
    // generated dynamically
    let customElementClassChoices = [];
    // array into nestings we need to simplify yo work
    _.forEach(wcfLibrariesCache, (lib) => {
      if (typeof lib.name !== typeof undefined) {
        // @notice this effectively assumes there is only 1 def per class
        wcfLibraries[lib.wcfactory.customElementClass] = lib;
        customElementClassChoices.push({
          name: `${lib.name} -- ${lib.description}. ${Object.keys(lib.dependencies).length} dependencies`,
          value: lib.wcfactory.customElementClass
        });
      }
    });
    return this.prompt([
      {
        type: "list",
        name: "customElementClass",
        message: "Custom element base class to use",
        store: true,
        choices: customElementClassChoices
      },
      {
        type: "input",
        name: "name",
        message: "Element name",
        validate: function (value) {
          if ((/([a-z]*)-([a-z]*)/).test(value)) { return true; }
          return 'name requires a hyphen and all lowercase';
        }
      },
      {
        type: "input",
        name: "description",
        message: "Description / purpose of the element"
      },
      {
        type: "input",
        name: "author",
        message: "Author of this element",
        store: true
      },
      {
        type: "input",
        name: "copyrightOwner",
        message: "Copyright owner of this work",
        store: true,
      },
      {
        type: "list",
        name: "license",
        message: "Software License to use",
        store: true,
        default: "apache2",
        choices: [
          {
            name: "Apache 2.0",
            value: "Apache-2.0"
          },
          {
            name: "MIT",
            value: "MIT"
          },
          {
            name: "BSD 3-clause",
            value: "BSD-3-Clause"
          },
          {
            name: "BSD 2-clause",
            value: "BSD-2-Clause"
          }
        ]
      },
      {
        type: "list",
        name: "useSass",
        when: answers => {
          return packageJson.wcfactory.askSASS;
        },
        message: "Do you want to use Sass in this element?",
        store: true,
        choices: [
          {
            name: "Yes",
            value: true
          },
          {
            name: "No",
            value: false
          }
        ]
      },
      {
        type: "list",
        name: "sassLibrary",
        when: answers => {
          return answers.useSass && packageJson.wcfactory.askSASS;
        },
        message: "Do want to use existing Sass dependencies?",
        choices: [
          {
            name: packageJson.wcfactory.sass.name,
            value: {
              pkg: packageJson.wcfactory.sass.pkg,
              path: packageJson.wcfactory.sass.path
            }
          },
          {
            name: "No thanks. I'll provide my own later",
            value: null
          }
        ]
      },
      {
        type: "list",
        name: "addProps",
        message: "Do you want custom properties? (typically yes)",
        when: answers => {
          return packageJson.wcfactory.askProps;
        },
        store: true,
        choices: [
          {
            name: "Yes",
            value: true
          },
          {
            name: "No",
            value: false
          }
        ]
      },
      {
        type: "list",
        name: "useHAX",
        message: "Auto build support for the HAX authoring system?",
        store: true,
        when: answers => {
          return answers.addProps && packageJson.wcfactory.askHAX;
        },
        choices: [
          {
            name: "Yes",
            value: true
          },
          {
            name: "No",
            value: false
          }
        ]
      },
      {
        type: 'recursive',
        message: 'Add a new property?',
        name: 'propsList',
        when: answers => {
          return answers.addProps;
        },
        prompts: [
          {
            type: 'input',
            name: 'name',
            message: "Name (examples: title, fistName, urlLocation)",
            validate: function (value) {
              if ((/\w/).test(value)) { return true; }
              return 'Property name must be a single word';
            }
          },
          {
            type: 'list',
            name: 'type',
            message: "type of value (the way it is used as data)",
            default: "String",
            choices: [
              {
                name: "String, text based input",
                value: "String"
              },
              {
                name: "Boolean, true/false value",
                value: "Boolean"
              },
              {
                name: "Number, number like 54",
                value: "Number"
              },
              {
                name: "Object, complex item storing multiple types",
                value: "Object"
              },
              {
                name: "Array, list of types",
                value: "Array"
              },
              {
                name: "Date, javascript date based object",
                value: "Date"
              },
            ]
          },
          {
            type: 'input',
            name: 'value',
            message: "Default value (leave blank for none)",
          },
          {
            type: 'list',
            name: 'reflectToAttribute',
            message: "Make available in css styles? [name=\"stuff\"] { color: blue; }",
            default: false,
            choices: [
              {
                name: "No",
                value: false
              },
              {
                name: "Yes",
                value: true
              },
            ]
          },
          {
            type: 'list',
            name: 'observer',
            message: "Notice changes to this property?",
            default: true,
            choices: [
              {
                name: "Yes",
                value: true
              },
              {
                name: "No",
                value: false
              },
            ]
          },
        ]
      }
    ]).then(answers => {
      // ensure answer is in kebabcase and lowercase
      answers.name = _.kebabCase(answers.name).toLowerCase();
      let name = answers.name.split("-")[1];
      this.capitalizeFirstLetter = (string) => {
        return string[0].toUpperCase() + string.slice(1);
      };
      this.props = {
        year: new Date().getFullYear(),
        orgNpm: packageJson.wcfactory.orgNpm,
        monorepo: packageJson.wcfactory.monorepo,
        orgGit: packageJson.wcfactory.orgGit,
        gitRepo: packageJson.wcfactory.gitRepo,
        author: answers.author,
        copyrightOwner: answers.copyrightOwner,
        license: answers.license,
        name: answers.name,
        humanName: this.capitalizeFirstLetter(answers.name.replace('-', ' ')),
        description: answers.description,
        elementName: answers.name,
        addProps: answers.addProps,
        propsListRaw: answers.propsList,
        includesString: '',
        connectedString: '',
        constructorString: '',
        additionalFunctionsString: '',
        propsList: {},
        propsListString: '',
        useHAX: answers.useHAX,
        haxList: {},
        haxListString: '',
        storyPropDeclaration: '',
        propsBindingFactory: '',
        storyHTMLProps: '',
        customElementClass: answers.customElementClass,
        activeWCFLibrary: wcfLibraries[answers.customElementClass],
        elementClassName: _.chain(answers.name)
          .camelCase()
          .upperFirst()
          .value(),
        readmeName: _.upperFirst(name),
        lowerCaseName: name,
        camelCaseName: _.camelCase(answers.name),
        useSass: answers.useSass,
        sassLibraryPkg: false,
        sassLibraryPath: false,
        libraryScripts: '',
        libraryDevDependencies: '',
        libraryDependencies: '',
        generatorWCFactoryVersion: packageJson.version
      };
      _.forEach(this.props.propsListRaw, (prop) => {
        if (prop.observer) {
          prop.observer = '_' + prop.name + 'Changed';
        }
        this.props.propsList[prop.name] = prop;
      });
      this.props.propsListString = JSON.stringify(this.props.propsList, null, '  ')
      // generate a string that can pull together the values needed for an HTML string
      _.forEach(this.props.propsListRaw, (prop) => {
        let method = 'text';
        // figure out the method to use as a knob
        switch (prop.type) {
          case 'Boolean':
          case 'Number':
          case 'Object':
          case 'Array':
          case 'Date':
            method = prop.type.toLowerCase();
          break;
          default: 
            method = 'text';
          break;
        }
        this.props.storyPropDeclaration += '  const ' + prop.name + ' = ' + method + '("' + prop.name + '", "' + prop.value + '");' + "\n";
      });
      _.forEach(this.props.propsListRaw, (prop) => {
        this.props.storyHTMLProps += _.kebabCase(prop.name) + '="${' + prop.name + '}"; ';
      });
      // work on HAX integration if requested
      if (this.props.useHAX) {
        this.props.includesString += 'import { HAXWiring } from "hax-body-behaviors/lib/HAXWiring.js"';
        // load props in from this dynamically generated function call
        this.props.connectedString = 'this.HAXWiring = new HAXWiring;' + "\n" + '    this.HAXWiring.setHaxProperties(' + this.props.elementClassName + '.haxProperties, ' + this.props.elementClassName + '.tag, this);';
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
      // convert to string so we can write to the {name}-hax.json file
      this.props.haxListString = JSON.stringify(this.props.haxList, null, '  ')
      // step through the active package.json file and grab the pieces we most directly need
      this.props.templateReturnFunctionPart = this.props.activeWCFLibrary.wcfactory.templateReturnFunctionPart;
      // work on scripts
      _.forEach(this.props.activeWCFLibrary.scripts, (version, dependency) => {
        this.props.libraryScripts += `"${dependency}":"${version}",`;
      });
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
          this.props.propsBindingFactory += '<div>' + this.props.activeWCFLibrary.wcfactory.propertyBinding.prefix + prop.name + this.props.activeWCFLibrary.wcfactory.propertyBinding.suffix +'</div>' + "\n";
        });
      }
      _.forEach(this.props.propsListRaw, (prop) => {
        // convert to object so we can build functions
        if (prop.observer) {
          this.props.additionalFunctionsString +=`  // Observer ${prop.name} for changes
          _${prop.name}Changed (newValue, oldValue) {
            if (typeof newValue !== typeof undefined) {
              console.log(newValue);
            }
          }` + "\n\n";
        }
      });
      if (answers.useSass) {
        if (answers.sassLibrary && answers.sassLibrary.pkg) {
          this.props.sassLibraryPkg = answers.sassLibrary.pkg;
        }

        if (answers.sassLibrary && answers.sassLibrary.path) {
          this.props.sassLibraryPath = answers.sassLibrary.path;
        }
        if (this.props.libraryDependencies === '') {
          this.props.libraryDependencies = `"${answers.sassLibrary.pkg}":"*"`;
        }
        else {
          this.props.libraryDependencies += `,"${answers.sassLibrary.pkg}":"*"`;
        }
      }
      mkdirp.sync(this.props.elementName);
    });
  }

  writing() {
    this.destinationRoot(elementsDirectory);
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
      this.destinationPath(
        `${this.props.elementName}/LICENSE.md`
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath(`src/properties.json`),
      this.destinationPath(
        `${this.props.elementName}/src/${this.props.elementName}-properties.json`
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
    )

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
        this.destinationPath(`${this.props.elementName}/src/${this.props.elementName}.css`)
      )
    }

    this.fs.copyTpl(
      this.templatePath("src/element.html"),
      this.destinationPath(`${this.props.elementName}/src/${this.props.elementName}.html`),
      this.props
    );

    this.fs.copyTpl(
      this.sourceRoot(`../wcfLibraries/${this.props.activeWCFLibrary.main}`),
      this.destinationPath(
        `${this.props.elementName}/src/${this.props.elementName}.js`
      ),
      this.props
    );
  }
  install() {
    process.chdir(elementsDirectory + this.props.elementName);

    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }

  end() {
    this.spawnCommand("yarn", ["run", "build"]);
  }
};
