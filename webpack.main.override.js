// webpack.main.override.js
module.exports = {
  target: 'electron-main',
  externals: {
    keytar: 'commonjs2 keytar',
  },
};
