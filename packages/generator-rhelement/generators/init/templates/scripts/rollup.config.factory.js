import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

function umdConfig({ elementName, className } = {}) {
  const umdFilename = `${elementName}.umd.js`;

  return {
    input: umdFilename,
    output: {
      file: umdFilename,
      format: "umd",
      sourcemap: true,
      name: className
    },
    plugins: [
      commonjs(),
      babel({
        // exclude: "node_modules/**" // only transpile our source code
      }),
      uglify()
    ],
    external: id => id.startsWith("..")
  };
}

function es5Config({ elementName, className } = {}) {
  const es5Filename = `${elementName}.es5.js`;

  return {
    input: es5Filename,
    output: {
      file: es5Filename,
      format: "esm",
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ],
    external: id => id.startsWith(".")
  };
}

function es6Config({ elementName, className } = {}) {
  const es6Filename = `${elementName}.js`;

  return {
    input: es6Filename,
    output: {
      file: es6Filename,
      format: "esm",
      sourcemap: true
    },
    plugins: [uglify()],
    external: id => id.startsWith(".")
  };
}

export default function factory({ elementName, className } = {}) {
  return [
    umdConfig({ elementName, className }),
    es5Config({ elementName, className }),
    es6Config({ elementName, className })
  ];
}