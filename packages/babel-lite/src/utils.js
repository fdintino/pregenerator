import clone from 'shallow-clone';

export { clone };

export function includes(arr, val) {
  return (arr.indexOf(val) > -1);
}

export function extend(target, ...sources) {
  let source = [];
  sources.forEach(src => {
    source = source.concat([src, Object.getPrototypeOf(src)]);
  });
  return Object.assign(target, ...source);
}

export function repeating(n, str) {
  str = str === undefined ? ' ' : str;

  if (typeof str !== 'string') {
    throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof str}\``);
  }

  if (n < 0 || !Number.isFinite(n)) {
    throw new TypeError(`Expected \`count\` to be a positive finite number, got \`${n}\``);
  }

  let ret = '';

  do {
    if (n & 1) {
      ret += str;
    }

    str += str;
  } while ((n >>= 1));

  return ret;
}

export function assign(...args) {
  Object.assign(...args);
}

export function uniq(arr) {
  return Array.from(new Set(arr));
}

export function compact(array) {
  let resIndex = 0;
  const result = [];

  if (array == null) {
    return result;
  }

  for (const value of array) {
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}
