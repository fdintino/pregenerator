const fs = require('fs');
const {compile} = require('pregenerator');

const contents = fs.readFileSync(`${__dirname}/test.generators.es6.js`, 'utf-8');

eval(compile(contents));
