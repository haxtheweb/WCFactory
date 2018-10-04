const Generator = require("yeoman-generator");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require("mkdirp");
const process = require("process");
<<<<<<< HEAD
const { buildsDir, buildData, factoryDir } = require('@wcfactory/common/config')

=======
const cwd = process.cwd();
const buildsDirectory = `${cwd}/builds`;
const factoriesDirectory = `${cwd}/factories`;
var buildData = {};
>>>>>>> 22955ed3262389de154ff8bb36eaa4643df1b304
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.props = opts
  }

<<<<<<< HEAD
  writing() {
    Object.assign(this.props, {
      buildData: buildData,
      dependencies: `    "@webcomponents/webcomponentsjs": "2.1.3",` + "\n",
      imports: '',
    })
    // package files of each element
    let files = glob.sync(
      `${factoryDir}/${this.props.factory}/elements/*/package.json`
    );
    _.forEach(files, val => {
      let json = JSON.parse(fs.readFileSync(val, "utf8"));
      if (json.version && !json.private) {
        this.props.dependencies +=
          `    "${json.name}" : "${json.version}",` + "\n";
        this.props.imports +=
          `    import "${json.name}/${json.main}";` + "\n";
=======
  prompting() {
    // @todo generate this dynamically
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
>>>>>>> 22955ed3262389de154ff8bb36eaa4643df1b304
      }

    });
    // trim that last , if needed
    if (this.props.dependencies !== "") {
      this.props.dependencies = this.props.dependencies.slice(0, -2);
    }
    // create folder to populate
    mkdirp.sync(`${buildsDir}/${this.props.name}`);
    // copy all files that don't start with an underscore
    this.fs.copyTpl(
      this.sourceRoot(`templates/builds/${buildData[this.props.build].key}`),
      this.destinationPath(`${buildsDir}/${this.props.name}`),
      this.props,
      { ignore: ["_common", ".DS_Store"] }
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/package.json"),
      this.destinationPath(
        `${buildsDir}/${this.props.name}/package.json`
      ),
      this.props
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/build.html"),
      this.destinationPath(
        `${buildsDir}/${this.props.name}/dist/build.html`
      ),
      this.props
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/build.js"),
      this.destinationPath(
        `${buildsDir}/${this.props.name}/build.js`
      ),
      this.props
    );
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/polymer.json"),
      this.destinationPath(
        `${buildsDir}/${this.props.name}/polymer.json`
      ),
      this.props
    );
  }

  install() {
    process.chdir(path.join(buildsDir, this.props.name));
    console.log(process.cwd())
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }

  end() {
    this.spawnCommandSync("polymer", ["build"]);
    this.fs.copy(
      this.sourceRoot(`${buildsDir}/${this.props.name}/build`),
      this.destinationPath(
        `${buildsDir}/${this.props.name}/webcomponents`
      )
    );
  }
};
