const Generator = require("yeoman-generator");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { glob } = require("glob");
const mkdirp = require("mkdirp");
const process = require("process");
const { config, buildsDir, buildData, factoryDir, userConfig } = require('@wcfactory/common/config')
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.props = opts
  }
  writing() {
    // load factory's package
    const packageJson = require(`${this.props.factory}/package.json`);
    this.props.version = packageJson.version;
    this.props.author = config.author;
    this.props.copyrightOwner = config.copyrightOwner;
    this.props.license = config.license;
    this.props.themeName = this.props.name;
    this.props.camelCaseName = _.chain(this.props.name)
      .camelCase()
      .upperFirst()
      .value();
    process.chdir(userConfig.companyDir);
    Object.assign(this.props, {
      buildData: buildData,
      dependencies: `    "@webcomponents/webcomponentsjs": "2.2.1",` + `\n    "web-animations-js":"2.3.1",` + "\n",
      imports: '',
    })
    // package files of each element
    let files = glob.sync(
      `/${this.props.factory}/elements/*/package.json`
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
      { ignore: ["_common", ".DS_Store", "themeName.info", "themeName.info.yml", "themeName.theme"] }
    );
    if (buildData[this.props.build].key === 'BackdropCMS' || buildData[this.props.build].key === 'Drupal-7') {
      this.fs.copyTpl(
        this.sourceRoot(`templates/builds/${buildData[this.props.build].key}/themeName.info`),
        this.destinationPath(
          `${buildsDir}/${this.props.name}/${this.props.name}.info`
        ),
        this.props
      );
    }
    else if (buildData[this.props.build].key === 'GravCMS') {
      this.fs.copyTpl(
        this.sourceRoot(`templates/builds/${buildData[this.props.build].key}/themeName.yaml`),
        this.destinationPath(
          `${buildsDir}/${this.props.name}/${this.props.name}.yaml`
        ),
        this.props
      );
      this.fs.copyTpl(
        this.sourceRoot(`templates/builds/${buildData[this.props.build].key}/themeName.php`),
        this.destinationPath(
          `${buildsDir}/${this.props.name}/${this.props.name}.php`
        ),
        this.props
      );
    }
    else if (buildData[this.props.build].key === 'Drupal-8') {
      this.fs.copyTpl(
        this.sourceRoot(`templates/builds/${buildData[this.props.build].key}/themeName.info.yml`),
        this.destinationPath(
          `${buildsDir}/${this.props.name}/${this.props.name}.info.yml`
        ),
        this.props
      );
      this.fs.copyTpl(
        this.sourceRoot(`templates/builds/${buildData[this.props.build].key}/themeName.theme`),
        this.destinationPath(
          `${buildsDir}/${this.props.name}/${this.props.name}.theme`
        ),
        this.props
      );
    }
    // allow for theme to define it's own package
    if (fs.existsSync(path.join('templates', 'builds', buildData[this.props.build].key, 'package.json'))) {
      this.fs.copyTpl(
        this.sourceRoot(`templates/builds/${buildData[this.props.build].key}/package.json`),
        this.destinationPath(
          `${buildsDir}/${this.props.name}/package.json`
        ),
        this.props
      );
    }
    else {
      this.fs.copyTpl(
        this.sourceRoot("templates/builds/_common/package.json"),
        this.destinationPath(
          `${buildsDir}/${this.props.name}/package.json`
        ),
        this.props
      );
    }
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
        `${buildsDir}/${this.props.name}/dist/build.js`
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
    this.fs.copyTpl(
      this.sourceRoot("templates/builds/_common/manifest.json"),
      this.destinationPath(
        `${buildsDir}/${this.props.name}/manifest.json`
      ),
      this.props
    );
  }

  install() {
    process.chdir(path.join(buildsDir, this.props.name));
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
