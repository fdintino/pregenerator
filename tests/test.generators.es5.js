const fs = require('fs');
const {compile} = require('pregenerator/test');

const contents = fs.readFileSync(`${__dirname}/test.generators.es6.js`, 'utf-8');

(function() {
  eval(compile(contents));
}());
