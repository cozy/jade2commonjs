#!/usr/bin/env node

'use strict';

var fs       = require('fs');
var path     = require('path');
var mkdirp   = require('mkdirp');
var glob     = require('glob');
var anymatch = require('anymatch');
var jade     = require('jade');
var program  = require('commander');
var chalk    = require('chalk');

var options = {};
var ignored = [];

var wrapper = "var jade = require('pug-runtime'); module.exports = ";
var msg     = '  ' + chalk.gray('rendered') + ' ' + chalk.cyan('%s');

program
  .version(
    'jade2commonjs: ' + require('./package.json').version
  )
  .usage('[options] [dir|file ...]')
  .option('-o, --out <dir>', 'output the compiled js modules to <dir>')
  .option('-p, --path <path>', 'filename used to resolve includes')
  .option('-D, --no-debug', 'compile without debugging (smaller functions)')
  .option('-i, --ignore [pattern]', 'anymatch patterns to ignore when compiling <dir> (repeatable)', ignore, ignored);

program.parse(process.argv);


// --path
options.filename = program.path;
// --no-debug
options.compileDebug = program.debug;


var files = program.args;

if (files.length) {
  files.forEach(function (file) {
    render(file);
  });
}


/**
 * Collect ignored patterns
 */
function ignore (value, memo) {
  memo.push(value);
  return memo;
}


/**
 * Processing the given path, compiling the `.jade` files found, ignoring files
 * mentionned in `--ignore` flag.
 * Always walk subdirectories.
 */
function render (base, rootPath) {
  glob(base + '/**/*.jade', function (err, matches) {
    if (err) { return console.error(err); }

    matches.forEach(function (file){
      if (anymatch(ignored, file)) { return; }

      var relPath  = path.relative(base, file);
      var out      = program.out || base;
      var basedir  = path.join(process.cwd(), out, path.dirname(relPath));
      var basename = path.basename(file, '.jade') + '.js';

      mkdirp(basedir, function (err) {
        if (err) { return console.error(err); }

        var fn = jade.compileFileClient(file, options);
        fs.writeFile(path.join(basedir, basename), wrapper + fn, function () {
          console.log(msg, path.normalize(file));
        });
      });
    });
  });
}
