const Generator = require("yeoman-generator");
const _ = require("lodash");
const fs = require("fs");
const glob = require("glob");
const mkdirp = require("mkdirp");
const process = require("process");
const cwd = process.cwd();
const buildsDirectory = `${cwd}/products/builds`;
const factoriesDirectory = `${cwd}/factories`;
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
    let factoryOptions = [];
    let folders = glob.sync(`${factoriesDirectory}/*`);
    _.forEach(folders, val => {
      let name = val.split("/").pop();
      factoryOptions.push({
        name: name,
        value: name
      });
    });
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
        dependencies: `    "@webcomponents/webcomponentsjs": "2.1.3",` + "\n",
        imports: '',
      };
      // package files of each element
      let files = glob.sync(
        `${factoriesDirectory}/${this.props.factory}/elements/*/package.json`
      );
      _.forEach(files, val => {
        let json = JSON.parse(fs.readFileSync(val, "utf8"));
        if (json.version && !json.private) {
          this.props.dependencies +=
            `    "${json.name}" : "${json.version}",` + "\n";
          this.props.imports +=
            `    import "${json.name}/${json.main}";` + "\n";
        }

      });
      // trim that last , if needed
      if (this.props.dependencies !== "") {
        this.props.dependencies = this.props.dependencies.slice(0, -2);
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
      { ignore: ["_common", ".DS_Store"] }
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/package.json"),
      this.destinationPath(
        `${buildsDirectory}/${this.props.name}/package.json`
      ),
      this.props
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/build.html"),
      this.destinationPath(
        `${buildsDirectory}/${this.props.name}/dist/build.html`
      ),
      this.props
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/build.js"),
      this.destinationPath(
        `${buildsDirectory}/${this.props.name}/build.js`
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
  }

  end() {
    this.spawnCommandSync("polymer", ["build"]);
    this.fs.copy(
      this.sourceRoot(`${buildsDirectory}/${this.props.name}/build`),
      this.destinationPath(
        `${buildsDirectory}/${this.props.name}/webcomponents`
      )
    );
  }
};
