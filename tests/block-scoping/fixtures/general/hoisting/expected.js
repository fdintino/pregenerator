var _loop = function () {
  if (_isArray) {
    if (_i >= _iterator.length) return "break";
    _ref = _iterator[_i++];
  } else {
    _i = _iterator.next();
    if (_i.done) return "break";
    _ref = _i.value;
  }
  var i = _ref;
  x = 5;
  _f = {
    f: 2
  };
  f = _f.f;
  fns.push(function () {
    return i * x;
  });
};
for (var _iterator = nums, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
  var _ref;
  var x;
  var _f;
  var f;
  var _ret = _loop();
  if (_ret === "break") break;
}
