const pjson = require('./package.json');

const {presets, plugins} = pjson.babel;

module.exports = {
  presets,
  plugins,
};
