// webpack.preload.override.js
module.exports = {
  target: 'electron-preload',
  externals: {
    keytar: 'commonjs2 keytar',
  },
};
