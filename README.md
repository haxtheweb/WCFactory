# Web Component Factory

A factory that churns out web components, library agnostic with a unified development, testing, and build to production pipeline. We want to eliminate the barriers to web component adoption because as of Oct 23rd, 89.18% of all traffic can handle web components with *no polyfills*

## Vision
- 1 command to get everything up and going
- Never have to understand the complexities of tooling
- CLI should seek to empower as many people as possible
- Anyone should be able to manage, create, and share elements in an element library
- Seamless sharing to webcomponents.org, npm, and git
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
- Storybook for entire element catelogue
- Unified CLI that can create anything it finds a definition for in `./wcfLibraries/`
- All `example-element` would be worked on in `example-element/src`
- Gulp based dev routines + built in serve + compile to AMD,UMD,ES5 and ES6/native, per element for complete break away flexibility
- Data binding definitions mapped across element libraries (when applicable)
- Ability to add any customElement baseClass definintion you want!
- Support for [HAX schematic wiring](http://haxtheweb.org/) as a single question!

## End user support
Safari, Firefox, Chrome, Opera, Edge (polyfill), IE 11 (polyfill); all of which are to be supported natively during the built in build routine. This should not be a configuration step for developers, it should just happen! As Edge supports it natively (probably by late 2019) it will just work anyway :)
