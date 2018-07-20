const fs = require("fs");
const path = require("path");

const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const trim = require("trim");
<%_ if (useSass) { _%>
const sass = require('node-sass');
<%_ } _%>

gulp.task("compile", () => {
  return gulp
    .src("./<%= elementName %>.js")
    .pipe(
      replace(
        /^(import .*?)(['"]\.\.\/(?!\.\.\/).*)(\.js['"];)$/gm,
        "$1$2.compiled$3"
      )
    )
    .pipe(babel())
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".compiled"
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("watch", () => {
  return gulp.watch("./src/*", gulp.series("merge", "compile"));
});

gulp.task("merge", () => {
  return gulp
    .src("./src/<%= elementName %>.js")
    .pipe(
      replace(/extends\s+Rhelement\s+{/, (classStatement, line, jsFile) => {
        // extract the templateUrl and styleUrl with regex.  Would prefer to do
        // this by require'ing <%= elementName %>.js and asking it directly, but without
        // node.js support for ES modules, we're stuck with this.
        const oneLineFile = jsFile.split("\n").join(" ");
        const [
          ,
          templateUrl
        ] = /get\s+templateUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );

        const html = fs
          .readFileSync(path.join("./src", templateUrl))
          .toString()
          .trim();

        const [
          ,
          styleUrl
        ] = /get\s+styleUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );

        const styleFilePath = path.join("./src", styleUrl);

<%_ if (useSass) { _%>
        const cssResult = sass.renderSync({
          file: styleFilePath
        }).css;
<%_ } else { _%>
        const cssResult = fs.readFileSync(styleFilePath);
<%_ } _%>

        return `${classStatement}
  get html() {
    return \`
<style>
${stripCssComments(cssResult).trim()}
</style>

${html}\`;
  }
`;
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("default", gulp.series("merge", "compile"));

gulp.task("dev", gulp.series("merge", "compile", "watch"));
