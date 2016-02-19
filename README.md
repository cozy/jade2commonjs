# Jade2Commonjs

Simple CLI tool to wrap jade generated functions into commonjs modules.

We sometimes need to export [Jade](https://github.com/pugjs/jade) templates to JavaScript functions, but need them to be wrapped in CommonJS modules to be able to import them later. Compiling to JS functions is properly handled by Jade lib/CLI, but wrapping in modules isn't. This tool does it.


## Installation

Install it _via_ NPM/Github globally or in your project. You'll need the [Jade/Pug runtime](https://github.com/pugjs/pug-runtime) to get you modules working when you'll import them later. The runtime is installed for NPM < 2.x as _peer dependency_, which is not wiith NPM 3. If you use NPM 3, you need to install it manually.

```sh
$ npm install [--global] --save-dev cozy/jade2commonjs
# if you use NPM 3, in your project
$ npm install --save pug-runtime
```

## Usage

```sh
$ jade2commonjs [options] [dir|file ...]
```

Render `file`s and `dir`s into CommonJS modules files. When passing `dir`s, the directories are parsed recursively and tree is preserved on output.


## Options

```sh
-h, --help              output usage information
-V, --version           output the version number
-o, --out <dir>         output the compiled js modules to <dir>
-p, --path <path>       filename used to resolve includes
-D, --no-debug          compile without debugging (smaller functions)
-i, --ignore [pattern]  anymatch patterns to ignore when compiling <dir> (repeatable)
```

if you're familiar to the jade-cli, this is a smaller version of their options. Jade2Commonjs adds a `ignore` flag that you can use to exclude some files to compile (such as partials).


## Examples

Render all files in `server/views` in same folders as originals:

```sh
$ jade2commonjs server/views
```

Render all files in `server/views` in a `template` folder:

```sh
$ jade2commonjs --out templates server/views
```

Render all files in `server/views` but partials (starting with `_`) and `index.jade`, without debug statements:

```sh
$ jade2commonjs --no-debug --ignore '**/_*.jade' --ignore 'index.jade' server/views
```
