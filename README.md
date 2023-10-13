[![#HAXTheWeb](https://img.shields.io/badge/-HAXTheWeb-999999FF?style=flat&logo=data:image/svg%2bxml;base64,PHN2ZyBpZD0iZmVhMTExZTAtMjEwZC00Y2QwLWJhMWQtZGZmOTQyODc0Njg1IiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE4NC40IDEzNS45NyI+PGRlZnM+PHN0eWxlPi5lMWJjMjAyNS0xODAwLTRkYzItODc4NS1jNDZlZDEwM2Y0OTJ7ZmlsbDojMjMxZjIwO308L3N0eWxlPjwvZGVmcz48cGF0aCBjbGFzcz0iZTFiYzIwMjUtMTgwMC00ZGMyLTg3ODUtYzQ2ZWQxMDNmNDkyIiBkPSJNNzguMDcsODMuNDVWNTVIODYuMnY4LjEzaDE2LjI2djQuMDdoNC4wN1Y4My40NUg5OC40VjY3LjE5SDg2LjJWODMuNDVaIi8+PHBvbHlnb24gcG9pbnRzPSIxNTMuMTMgNjMuNyAxNTMuMTMgNTEuMzkgMTQwLjU0IDUxLjM5IDE0MC41NCAzOS4wOSAxMjcuOTUgMzkuMDkgMTI3Ljk1IDI2Ljc5IDEwMi43OCAyNi43OSAxMDIuNzggMzkuMDkgMTE1LjM2IDM5LjA5IDExNS4zNiA1MS4zOSAxMjcuOTUgNTEuMzkgMTI3Ljk1IDYzLjcgMTQwLjU0IDYzLjcgMTQwLjU0IDc2IDEyNy4zNiA3NiAxMjcuMzYgODguMyAxMTQuNzggODguMyAxMTQuNzggMTAwLjYxIDEwMi4xOSAxMDAuNjEgMTAyLjE5IDExMi45MSAxMjcuMzYgMTEyLjkxIDEyNy4zNiAxMDAuNjEgMTM5Ljk1IDEwMC42MSAxMzkuOTUgODguMyAxNTIuNTQgODguMyAxNTIuNTQgNzYgMTY1LjcyIDc2IDE2NS43MiA2My43IDE1My4xMyA2My43Ii8+PHBvbHlnb24gcG9pbnRzPSIzMy4xMyA2My43IDMzLjEzIDUxLjM5IDQ1LjcyIDUxLjM5IDQ1LjcyIDM5LjA5IDU4LjMxIDM5LjA5IDU4LjMxIDI2Ljc5IDgzLjQ4IDI2Ljc5IDgzLjQ4IDM5LjA5IDcwLjg5IDM5LjA5IDcwLjg5IDUxLjM5IDU4LjMxIDUxLjM5IDU4LjMxIDYzLjcgNDUuNzIgNjMuNyA0NS43MiA3NiA1OC44OSA3NiA1OC44OSA4OC4zIDcxLjQ4IDg4LjMgNzEuNDggMTAwLjYxIDg0LjA3IDEwMC42MSA4NC4wNyAxMTIuOTEgNTguODkgMTEyLjkxIDU4Ljg5IDEwMC42MSA0Ni4zMSAxMDAuNjEgNDYuMzEgODguMyAzMy43MiA4OC4zIDMzLjcyIDc2IDIwLjU0IDc2IDIwLjU0IDYzLjcgMzMuMTMgNjMuNyIvPjwvc3ZnPg==)](https://haxtheweb.org/)

# HAX
The authoring experience of HAX and the ability to make fast, static file backed websites rapidly.
Get all the details you want on [HAXTheWeb.org](https://haxtheweb.org/haxcms-1)!
HAX seeks to be the smallest possible back-end CMS to make HAX work and be able to build websites with it. Leveraging JSON Outline Schema, HAX is able to author multiple pages, which it then writes onto the file system. This way a slim server layer is just for basic authentication, knowing how to save files, and placing them in version control.

Watch and Read more about HAX here:
- Youtube channel - https://www.youtube.com/@haxtheweb
- HAXCellence https://oer.hax.psu.edu/bto108/sites/haxcellence/what-is-hax

# Issues / Support / Community
- Discord Channel - https://bit.ly/hax-discord
- Unified issue queue - https://github.com/elmsln/issues/issues
- Using Merlin directly in any HAX spaces and type "Issue" to jump start a report!

A factory that churns out web components, library agnostic with a unified development, testing, and build to production pipeline. We want to eliminate the barriers to web component adoption because as of Oct 23rd, 89.18% of all traffic can handle web components with *no polyfills* See (End user support)(#endusersupport) for full details below.

[Here's a video showing what this is and how it works](https://www.youtube.com/playlist?list=PLJQupiji7J5cAv7Jfr1V8FvUTx_jJrmCl).

### Quick Install
```bash
curl -fsSL https://raw.githubusercontent.com/elmsln/WCFactory/master/wcfactoryme.sh -o wcfactoryme.sh && sh wcfactoryme.sh
```

### Manual Install

Make sure you have a version of node v14.16.1 and above.
Verify that you have yarn enabled — if not [install yarn](https://yarnpkg.com/lang/en/docs/install/) and ensure it is [globally available via PATH](https://yarnpkg.com/lang/en/docs/cli/global/). If using Linux, make sure you add `--prefix /usr/local` at the end of each of these calls
```bash
yarn global add symlink-dir
yarn global add @wcfactory/cli
yarn global add polymer-cli
yarn global add lerna
yarn global add web-component-analyzer
yarn global add http-server
```

## Windows

[Cygwin command line](https://www.cygwin.com/) is lightly tested, but slower than true Bash environment.

### Windows Install

Make sure a path entry to yarn global binaries is present or `wcf` will fail. Yarn global binaries can be found in `C:\Users\<username>\AppData\Local\Yarn\bin`
To properly configure git endlines for Windows, run this configuration
```bash
git config --global core.autocrlf true
```

## Usage (company)
A company helps you manage multiple factories and the products they produce so you'll need to create one before you do anything else. **The company MUST be created in a directory above your user directory** in some manner. example: `/home/dana/Documents/git/company` or any directory above `/home/dana`.
```bash
# create a new company, a series of factories linked by the owner
mkdir my-company-name && cd my-company-name && wcf start
# create a new factory after you've made the company
wcf factory
# add a new element to the factory-name that you produced in the previous step
wcf element
```
Answer the prompts for your new element and you're off and running. To work on your new element called `new-name` perform the following:
```bash
cd {factoryName}/elements/new-name
yarn start
```
This will open the folder to the `elements/new-name/src` folder, start watching it for changes which will be compiled automatically (and documented), and open a mini-server (via `polymer serve`) which will allow you to edit the src directory files, compile them together and make them available for the localhost window for viewing.

## Library development
Storybook is built into the tooling to automatically be setup based on the properties and demos you create for the individual elements. You can fire it up from the factory level by running `yarn run storybook`. The default for elements is that their properties are analzed to generate knobs automatically and their demo is a mix of a live demo of the element + knobs as well as static demos from your element's `demo/index.html`.

## Publishing
The repo generated is managed by `lerna`. `lerna` allows you to manage multiple packages at once so that other people can take your individual elements you produce and use them as they please, while allowing you to develop everything in one repository.

`yarn run build` will perform the build step for the individual project. You may need to do this in order to get lerna to pick it up (we're still fleshing the workflow here out in the CLI).

`lerna run build --no-bail` will perform the build step in all elements

`lerna publish` will perform a publish to npmjs.com / yarn for each element in the factory.

## Build
The CLI supports building for different targets to produce a boilerplate as well as a build flow to get from nothing, to elements, to publishing, to built and served by a production website to all browser targets. To use build do the following:
- Have a factory with some elements in it
- Issue `yarn run build` from the factory, followed up `lerna publish` to publish versions of all elements
- Issue `wcf build`
- Answer the questions (picking a buildName), factory and output target (Drupal 7, Drupal 8, Static and CDN styles are supported)
- When finished, you'll have something in the `builds/{buildName}` directory that will work across all browsers!

## Storybook
The factories produced by this come equiped with storybook integration. To publish this out to the web in a static form, you can issue `yarn run build-storybook` which will place the build storybook in `{companyName}/storybooks/{factoryName}`.

## Vision
- 1 command to get everything up and going
- Never have to understand the complexities of tooling
- CLI should seek to empower as many people as possible
- Anyone should be able to manage, create, and share elements in an element library
- Seamless sharing to npmjs.com, and git
- Unify CLI, build step, and element packaging across all libraries
- Allow advanced developers to fork, tinker, and repurpose to their will

## Goals
- Empower anyone that knows how to create HTML,CSS and basic JS with web components
- Eliminate barriers to entry by abstracting tooling
- Create a single dependency (docker) requirement to participating effectively in the future of the web
- Support any platform matching https://custom-elements-everywhere.com/ conformance testing
- Support any custom element sub class you want to add

## Features
- Monorepo management via Lerna
- Storybook for entire element catalogue
- Unified CLI that can create anything it finds a definition for in `./wcfLibraries/`
- All `example-element` would be worked on in `example-element/src`
- Gulp based dev routines + built in serve + compile to AMD, UMD, ES5 and ES6/native, per element for complete break away flexibility
- Data binding definitions mapped across element libraries (when applicable)
- Ability to add any customElement baseClass definition you want!
- Support for [HAX schematic wiring](http://haxtheweb.org/) as a single question!

## End user support
Because of the Web component standard, babel and polyfills we support the following as part of our build routines.
- Chrome 50+
- Opera 47+
- IOS / Safari 9+
- FF 54+
- Edge 15+
- IE 11

This is confirmed to work with 98.26% of all global traffic (Aug-Sep 2018) and should work with 99.64% (difficult to confirm Android original browser) with only being 0.36% unknown. 93.83% of all traffic loads via ES Modules (async loading of assets, http2 is lightning). As of Oct 23, 2018, 89.18% of all traffic will not require any polyfills.

## Development (on wcfactory itself)

### Yarn and Lerna

We use a combination of Yarn Workspaces and Lerna to manage local developement and publishing of this monorepo. [Read more about that ingeration](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/#managing-dependencies-of-workspaces)

### Install

Clone and install dependencies with yarn install.

```bash
git clone https://github.com/elmsln/wcfactory.git
cd wcfactory
yarn install
```

Make the local version of the cli available globally.

```bash
cd packages/cli
yarn link
```

Verify that the cli is installed globally

```bash
wcf -h
```

### Troubleshooting

```
yarn install v1.10.1
error ../../package.json: Name contains illegal characters
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
```

There is an error in how package can be composed when using the factory command that fails to prepend a '@' in front of your NPM organization name if you don't manually add one.  This can lead to invalid package names.

To fix, modify your /package.json file where it says ```"orgNpm": "my-org",``` to be ```"orgNpm": "@my-org",```
