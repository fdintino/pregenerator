/* global window */
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
  var desc;
  for (var key in descs) {
    desc = descs[key];
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
      desc = descs[sym];
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

const symbolIterator = (() => {
  try {
    return Symbol.iterator ? Symbol.iterator : "@@iterator";
  } catch (e) {
    return "@@iterator";
  }
})();

export const arrayFrom = (function () {
  var toStr = Object.prototype.toString;
  var isCallable = function isCallable(fn) {
    return typeof fn === "function" || toStr.call(fn) === "[object Function]";
  };
  var toInteger = function toInteger(value) {
    var number = Number(value);
    if (isNaN(number)) return 0;
    if (number === 0 || !isFinite(number)) return number;
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function toLength(value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };

  var setGetItemHandler = function setGetItemHandler(isIterator, items) {
    var iterator = isIterator && items[symbolIterator]();
    return function getItem(k) {
      return isIterator ? iterator.next() : items[k];
    };
  };

  var getArray = function getArray(T, A, len, getItem, isIterator, mapFn) {
    // 16. Let k be 0.
    var k = 0;

    // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
    while (k < len || isIterator) {
      var item = getItem(k);
      var kValue = isIterator ? item.value : item;

      if (isIterator && item.done) {
        return A;
      } else {
        if (mapFn) {
          A[k] =
            typeof T === "undefined"
              ? mapFn(kValue, k)
              : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
      }
      k += 1;
    }

    if (isIterator) {
      throw new TypeError(
        "Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1"
      );
    } else {
      A.length = len;
    }

    return A;
  };

  // The length property of the from method is 1.
  return function from(arrayLikeOrIterator /*, mapFn, thisArg */) {
    // 1. Let C be the this value.
    var C = this;

    // 2. Let items be ToObject(arrayLikeOrIterator).
    var items = Object(arrayLikeOrIterator);
    var isIterator = isCallable(items[symbolIterator]);

    // 3. ReturnIfAbrupt(items).
    if (arrayLikeOrIterator == null && !isIterator) {
      throw new TypeError(
        "Array.from requires an array-like object or iterator - not null or undefined"
      );
    }

    // 4. If mapfn is undefined, then let mapping be false.
    var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
    var T;
    if (typeof mapFn !== "undefined") {
      // 5. else
      // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError(
          "Array.from: when provided, the second argument must be a function"
        );
      }

      // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments.length > 2) {
        T = arguments[2];
      }
    }

    // 10. Let lenValue be Get(items, "length").
    // 11. Let len be ToLength(lenValue).
    var len = toLength(items.length);

    // 13. If IsConstructor(C) is true, then
    // 13. a. Let A be the result of calling the [[Construct]] internal method
    // of C with an argument list containing the single item len.
    // 14. a. Else, Let A be ArrayCreate(len).
    var A = isCallable(C) ? Object(new C(len)) : new Array(len);

    return getArray(
      T,
      A,
      len,
      setGetItemHandler(isIterator, items),
      isIterator,
      mapFn
    );
  };
})();

(typeof window !== "undefined" ? window : global).pregeneratorHelpers = {
  _extends,
  objectWithoutProperties,
  objectDestructuringEmpty,
  toPrimitive,
  toPropertyKey,
  defineEnumerableProperties,
  defineProperty,
  arrayFrom,
};
