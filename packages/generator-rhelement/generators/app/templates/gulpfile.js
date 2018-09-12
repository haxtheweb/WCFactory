const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const trim = require("trim");
const decomment = require("decomment");
const sourcemaps = require("gulp-sourcemaps");
const uglifyES6 = require("gulp-uglify-es").default;
const uglifyES5 = require("gulp-uglify");
const gulpif = require("gulp-if");
const babel = require("gulp-babel");
<%_ if (useSass) { _%>
const sass = require('node-sass');
<%_ } _%>

gulp.task("compile", () => {
  //const htmlMinifier = require('gulp-html-minifier');
  const mergeStream = require("merge-stream");
  const PolymerProject = require("polymer-build").PolymerProject;
  const forkStream = require("polymer-build").forkStream;
  // read off polymer.json options for simplicity
  const project = new PolymerProject({});
  const cssSlam = require("css-slam").gulp;
  // create a build stream that we'll fork against to keep getting
  // different types of build routines
  const buildStream = mergeStream(project.sources(), project.dependencies());
  // Create a build pipeline to pipe both streams together to the 'build/' dir
  // Fork your build stream to write directly to the 'build/unbundled' dir
  const es6BuildStream = forkStream(buildStream)
    .pipe(gulpif(/\.js$/, uglifyES6()))
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulp.dest("build/es6"));
  // Fork your build stream to bundle your application and write to the 'build/bundled' dir
  const es5BuildStream = forkStream(buildStream)
    .pipe(project.addCustomElementsEs5Adapter())
    .pipe(
      gulpif(
        /\.js$/,
        babel({
          presets: ["@babel/env"]
        })
      )
    )
    .pipe(gulpif(/\.js$/, uglifyES5()))
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulp.dest("build/es5"));

  return gulp
    .src("./build/es5/<%= elementName %>.js")
    .pipe(
      replace(
        /^(import .*?)(['"]\.\.\/(?!\.\.\/).*)(\.js['"];)$/gm,
        "$1$2.umd$3"
      )
    )
    .pipe(
      rename({
        suffix: ".umd"
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("watch", () => {
  return gulp.watch("./src/*", gulp.series("merge", "compile", "cleanup"));
});

gulp.task("merge", () => {
  return gulp
    .src("./src/<%= elementName %>.js")
    .pipe(
    replace(/extends\s+<%= customElementClass %>\s+{/g, (classStatement, character, jsFile) => {
        // extract the templateUrl and styleUrl with regex.  Would prefer to do
        // this by require'ing <%= elementName %>.js and asking it directly, but without
        // node.js support for ES modules, we're stuck with this.
        const oneLineFile = jsFile.slice(character).split("\n").join(" ");
        const [
          ,
          templateUrl
        ] = /templateUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );

        let html = fs
          .readFileSync(path.join("./src", templateUrl))
          .toString()
          .trim();

        html = decomment(html);
        // pull properties off of the file location
        const [
          ,
          propertiesUrl
        ] = /propertiesUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );
        let props = fs
          .readFileSync(path.join("./src", propertiesUrl));
        props = stripCssComments(props).trim();

        // pull together styles from url
        const [
          ,
          styleUrl
        ] = /styleUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );
        const styleFilePath = path.join("./src", styleUrl);
<%_ if (useSass) { _%>
        let cssResult = sass.renderSync({
          file: styleFilePath
        }).css;
<%_ } else { _%>
        let cssResult = fs.readFileSync(styleFilePath);
<%_ } _%>
        cssResult = stripCssComments(cssResult).trim();
        return `${classStatement}
  <%= templateReturnFunctionPart %>\`
<style>
${cssResult}
</style>
${html}\`;
  }
  static get properties() {
    return ${props};
  }`;
      })
    )
    .pipe(gulp.dest("./"));
});

// shift build files around a bit and build source maps
gulp.task("cleanup", () => {
  gulp
    .src("./<%= elementName %>.js")
    .pipe(sourcemaps.init())
    .pipe(uglifyES6())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./"));
  return gulp
    .src("./<%= elementName %>.js")
    .pipe(
      rename({
        suffix: ".es5"
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(sourcemaps.init())
    .pipe(uglifyES5())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./"));
});

gulp.task("default", gulp.series("merge", "compile", "cleanup"));

gulp.task("dev", gulp.series("merge", "compile", "cleanup", "watch"));