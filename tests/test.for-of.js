var _compile;

if (typeof window === 'object') {
  _compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
  window.expect = window.chai.expect;
} else {
  _compile = require('pregenerator').compile;
  var chai = require('chai');
  global.assert = chai.assert;
  global.expect = chai.expect;
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  global.sinon = require('sinon');
}

function compile(src) {
  return _compile(src, {allowReturnOutsideFunction: true});
}

describe('for-of', function() {
  it('simple array', function() {
    eval(compile([
      'let elm;',
      'let arr = [0, 1, 2];',
      'let res = [];',
      '',
      'for (elm of arr) {',
      '  res.push(elm);',
      '}',
      '',
      'assert.deepEqual(res, arr);',
      ''
    ].join('\n')));
  });

  it('array pattern', function() {
    eval(compile([
      'let elm;',
      'let arr = [[0], [1], [2]];',
      'let res = [];',
      'for ([elm] of arr) {',
      '  res.push(elm);',
      '}',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('declaration', function() {
    eval(compile([
      'let arr = [0, 1, 2];',
      'let res = [];',
      '',
      'for (const elm of arr) {',
      '  res.push(elm);',
      '}',
      '',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('declaration array pattern', function() {
    eval(compile([
      'let arr = [[0], [1], [2]];',
      'let res = [];',
      '',
      'for (const [elm] of arr) {',
      '  res.push(elm);',
      '}',
      '',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('expression', function() {
    eval(compile([
      'let arr = [0, 1, 2];',
      'let res = [];',
      '',
      'let i;',
      'for (i of arr) res.push(i);',
      '',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('expression declaration', function() {
    eval(compile([
      'let arr = [0, 1, 2];',
      'let res = [];',
      'let i;',
      'for (const i of arr) res.push(i);',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('redeclare', function() {
    eval(compile([
      'let arr = [0, 1, 2];',
      'let res = [];',
      '',
      'for (let o of arr) {',
      '  const arr = o;',
      '  res.push(o);',
      '}',
      '',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('static', function() {
    eval(compile([
      'let elm;',
      'const arr = [0, 1, 2];',
      'let res = [];',
      '',
      'for (elm of arr) {',
      '  res.push(elm);',
      '}',
      '',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('static declaration', function() {
    eval(compile([
      'const arr = [0, 1, 2];',
      'let elm;',
      'let res = [];',
      '',
      'for (const elm of arr) {',
      '  res.push(elm);',
      '}',
      '',
      'assert.deepEqual(res, [0, 1, 2]);',
      'assert.equal(typeof elm, \'undefined\');',
      '',
    ].join('\n')));
  });

  it('ignore cases', function() {
    eval(compile([
      'var foo = [0, 1, 2];',
      'var res = [];',
      '',
      'for (var i of foo) {',
      '  res.push(i);',
      '  switch (i) {',
      '    case 1:',
      '      break;',
      '  }',
      '}',
      '',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('member expression', function() {
    eval(compile([
      'const obj = {};',
      'let arr = [0, 1, 2];',
      'let res = [];',
      'for (obj.prop of arr) {',
      '  res.push(obj.prop);',
      '}',
      'assert.equal(obj.prop, 2);',
      'assert.deepEqual(res, [0, 1, 2]);',
      ''
    ].join('\n')));
  });

  it('multiple', function() {
    eval(compile([
      'var arr = [0, 1, 2];',
      'var nums = [3, 4, 5];',
      'var res = [];',
      '',
      'for (var i of arr) {',
      '  res.push(i);',
      '}',
      '',
      'for (var i of nums) {',
      '  res.push(i);',
      '}',
      '',
      'assert.deepEqual(res, [0, 1, 2, 3, 4, 5]);',
      ''
    ].join('\n')));
  });

  it('nested label for-of', function() {
    eval(compile([
      'function d() {',
      '  return ["foo", "bar"];',
      '}',
      'function f() {',
      '  return [1];',
      '}',
      '',
      'var res = [];',
      '',
      'b: for (let c of d()) {',
      '  res.push(c);',
      '  for (let e of f()) {',
      '    continue b;',
      '  }',
      '  res.push("-");',
      '}',
      '',
      'assert.deepEqual(res, ["foo", "bar"]);',
      ''
    ].join('\n')));
  });
});
