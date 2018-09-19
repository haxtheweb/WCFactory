#!/usr/bin/env node

'use strict';

/*
 * NOTE: The contents of this file should work on as many version of Node.js
 * as possible. This means it *can not* use any >ES5 syntax and features.
 * Other files, which may use >=ES2015 syntax, should only be loaded
 * asynchronously after this version check has been performed.
 */

// NOTE 04-21-2017: Confirmed "semver" supports Node versions as low as 0.10
var semver = require('semver');
var version = require('../package.json').engines.node;
var rhelementVersion = require('../package.json').version;
var description = require('../package.json').description;
const { exec, spawn } = require('child_process')
const program = require('commander')
const yeoman = require('yeoman-environment')
const shell = require('shelljs')
// const generator = require('generator-rhelement')
const env = yeoman.createEnv()

// Exit early if the user's node version is too low.
if (!semver.satisfies(process.version, version)) {
  // Strip version range characters leaving the raw semantic version for output
  var rawVersion = version.replace(/[^\d\.]*/, '');
  console.log(
      'Rhelements requires at least Node v' + rawVersion + '. ' +
      'You have ' + process.version + '.\n'
  )
  process.exit(1);
}

/**
 * Register our yeoman generators
 */
env.register(require.resolve('generator-wcfactory/generators/app'), 'wcfactory:app')
env.register(require.resolve('generator-wcfactory/generators/init'), 'wcfactory:init')

/*
 * We are going to use commander to set up a nice user focused cli for accessing our
 * yeoman generator.
 */
program
  .version(wcfactoryVersion)
  .description(description)

program
  .command('new <name>')
  .description('Create a new element.')
  .action((name) => {
    env.run(`wcfactory:app ${name}`)
  })

program
  .command('init')
  .description('Create mono repo for your element library. You will only need to do this once.')
  .action((name) => {
    env.run(`wcfactory:init`)
  })

// instantiate commander
program.parse(process.argv);