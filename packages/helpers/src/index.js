export function objectWithoutProperties(src, excluded) {
  if (src == null) return {};
  var target = {};
  for (var i in src) {
    if (excluded.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(src, i)) continue;
    target[i] = src[i];
  }
  return target;
};

function _extends() {
  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

  return _extends.apply(this, arguments);
};

export { _extends as extends };

export function objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError('Cannot destructure undefined');
};


export function toPrimitive(input, hint /*: "default" | "string" | "number" | void */) {
  if (typeof input !== 'object' || input === null) {
    return input;
  }
  var symbolToPrimitive = (typeof Symbol !== 'undefined') ? Symbol.toPrimitive : '@@toPrimitive';
  var prim = input[symbolToPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || 'default');
    if (typeof res !== 'object') return res;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (hint === 'string' ? String : Number)(input);
};

export function toPropertyKey(arg) {
  var key = toPrimitive(arg, 'string');
  return typeof key === 'symbol' ? key : String(key);
};

global.pregeneratorHelpers = {
  extends: _extends,
  objectWithoutProperties,
  objectDestructuringEmpty,
  toPrimitive,
  toPropertyKey,
};
