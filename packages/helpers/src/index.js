export function objectWithoutProperties(src, excluded) {
  if (src == null) return {};
  var target = {};
  for (var i in src) {
    if (excluded.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(src, i)) continue;
    target[i] = src[i];
  }
  return target;
}

export function _extends() {
  var _extends =
    Object.assign ||
    function (target) {
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
}

export function objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

export function toPrimitive(
  input,
  hint /*: "default" | "string" | "number" | void */
) {
  if (typeof input !== "object" || input === null) {
    return input;
  }
  var symbolToPrimitive =
    typeof Symbol !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
  var prim = input[symbolToPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

export function toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

export function defineEnumerableProperties(obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  // Symbols are not enumerated over by for-in loops. If native
  // Symbols are available, fetch all of the descs object's own
  // symbol properties and define them on our target object too.
  if (Object.getOwnPropertySymbols) {
    var objectSymbols = Object.getOwnPropertySymbols(descs);
    for (var i = 0; i < objectSymbols.length; i++) {
      var sym = objectSymbols[i];
      var desc = descs[sym];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, sym, desc);
    }
  }
  return obj;
}

export function defineProperty(obj, key, value) {
  // Shortcircuit the slow defineProperty path when possible.
  // We are trying to avoid issues where setters defined on the
  // prototype cause side effects under the fast path of simple
  // assignment. By checking for existence of the property with
  // the in operator, we can optimize most of this overhead away.
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

global.pregeneratorHelpers = {
  _extends,
  objectWithoutProperties,
  objectDestructuringEmpty,
  toPrimitive,
  toPropertyKey,
  defineEnumerableProperties,
  defineProperty,
};
