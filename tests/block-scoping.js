var path = require('path');
var fs = require('fs');
var glob = require('glob');
var assert = require('chai').assert;
var {compile} = require('pregenerator');

const fixtureDir = __dirname + '/block-scoping/fixtures';

var files = glob.sync(`${fixtureDir}/exec/*.js`).concat(glob.sync(`${fixtureDir}/pass/*.js`));

describe('block scoping', () => {
  files.forEach(f => {
    var name = path.basename(f).replace(/\.js$/, '');

    if (name === 'export') {
      return;
    }

    it(name, function() {
      var content = fs.readFileSync(f, 'utf-8');
      var res = compile(content);
      eval(res.src);
    });
  });

  const compareDirs = glob.sync(`${fixtureDir}/general/*`);
  compareDirs.forEach(f => {
    var name = path.basename(f);
    if (!fs.lstatSync(f).isDirectory()) {
      return;
    }
    if (name === 'jsx-identifier') {
      return;
    }
    it(name, () => {
      const actual = fs.readFileSync(`${f}/actual.js`, 'utf-8');
      const expected = fs.readFileSync(`${f}/expected.js`, 'utf-8');
      assert.equal(expected.replace(/\n+/g, '\n'), compile(actual));
    });
  });
});
