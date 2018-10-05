const Generator = require("yeoman-generator");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require("mkdirp");
const process = require("process");
const { buildsDir, buildData, factoryDir } = require('@wcfactory/common/config')
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.props = opts
  }
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
