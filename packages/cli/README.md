@wcfactory/cli
==============

CLI for managing your custom elements at scale.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@wcfactory/cli.svg)](https://npmjs.org/package/@wcfactory/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@wcfactory/cli.svg)](https://npmjs.org/package/@wcfactory/cli)
[![License](https://img.shields.io/npm/l/@wcfactory/cli.svg)](https://github.com/elmsln/wcfactory/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @wcfactory/cli
$ cli COMMAND
running command...
$ cli (-v|--version|version)
@wcfactory/cli/0.1.7 darwin-x64 node-v10.10.0
$ cli --help [COMMAND]
USAGE
  $ cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cli hello [FILE]`](#cli-hello-file)
* [`cli help [COMMAND]`](#cli-help-command)
* [`cli init [FILE]`](#cli-init-file)

## `cli hello [FILE]`

describe the command here

```
USAGE
  $ cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/elmsln/wcfactory/blob/v0.1.7/src/commands/hello.ts)_

## `cli help [COMMAND]`

display help for cli

```
USAGE
  $ cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.2/src/commands/help.ts)_

## `cli init [FILE]`

describe the command here

```
USAGE
  $ cli init [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/init.ts](https://github.com/elmsln/wcfactory/blob/v0.1.7/src/commands/init.ts)_
<!-- commandsstop -->
