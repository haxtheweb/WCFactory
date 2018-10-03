const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const process = require("process");
const cwd = process.cwd();
const buildsDirectory = `${cwd}/products/builds`;
var buildData = {};
module.exports = class extends Generator {
  // constructor(args, opts) {
  //   super(args, opts)

  //   this.argument('name', {type: String, required: true})
  // }

  prompting() {
    // generated dynamically
    buildData = {
      static: {
        name: "Static boilerplate",
        key: "Static"
      },
      cdn: {
        name: "CDN based publish",
        key: "CDN"
      },
      drupal8: {
        name: "Drupal 8 (Twig)",
        key: "Drupal-8"
      },
      drupal7: {
        name: "Drupal 7",
        key: "Drupal-7"
      }
    };
    let buildOptions = [];
    // @todo generate off the file system or store in a config blob
    let factoryOptions = [
      {
        name: "Wrapper land",
        value: "wrapperland"
      }
    ];
    // array into nestings we need to simplify yo work
    _.forEach(buildData, (val, key) => {
      if (typeof val !== typeof undefined) {
        buildOptions.push({
          name: val.name,
          value: key
        });
      }
    });
    return this.prompt([
      {
        type: "string",
        name: "name",
        message: "Folder name for the build",
        required: true
      },
      {
        type: "string",
        name: "description",
        message: "Brief description for the build"
      },
      {
        type: "list",
        name: "factory",
        message: "Factory to build from",
        store: true,
        choices: factoryOptions
      },
      {
        type: "list",
        name: "build",
        message: "Type of build target",
        store: true,
        choices: buildOptions
      }
    ]).then(answers => {
      this.props = {
        name: answers.name,
        description: answers.description,
        build: answers.build,
        factory: answers.factory,
        buildData: buildData,
        dependencies: ""
      };
      // @todo generate off the file system factoryname/elements or store in a config blob
      let elements = ["thing-eis", "ls-aad-d", "dfs-fd"];
      // @todo get from factory JSON file
      let version = "latest";
      // work on scripts
      _.forEach(elements, (name, key) => {
        this.props.dependencies += `"${name}":"${version}",`;
      });
      // trim that last , if needed
      if (this.props.dependencies !== "") {
        this.props.dependencies = this.props.dependencies.slice(0, -1);
      }
      // create folder to populate
      mkdirp.sync(`${buildsDirectory}/${this.props.name}`);
    });
  }

  writing() {
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.sourceRoot(`templates/builds/${buildData[this.props.build].key}`),
      this.destinationPath(`${buildsDirectory}/${this.props.name}`),
      this.props,
      { ignore: ["_common"] }
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/package.json"),
      this.destinationPath(
        `${buildsDirectory}/${this.props.name}/package.json`
      ),
      this.props
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/polymer.json"),
      this.destinationPath(
        `${buildsDirectory}/${this.props.name}/polymer.json`
      ),
      this.props
    );
  }

  install() {
    process.chdir(`${buildsDirectory}/${this.props.name}`);
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
    this.spawnCommandSync("polymer", ["build"]);
  }

  end() {
    this.fs.copy(
      this.templatePath("build"),
      this.destinationPath("webcomponents")
    );
  }
};
