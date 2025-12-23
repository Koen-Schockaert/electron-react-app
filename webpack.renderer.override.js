const webpack = require('webpack');

module.exports = (config) => {
  /**
   * 1. Explicitly disable ALL Node core modules
   *    This silences the BREAKING CHANGE warnings
   */
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    fs: false,
    path: false,
    os: false,
    util: false,
    crypto: false,
    stream: false,
    buffer: false,
    http: false,
    https: false,
    zlib: false,
    net: false,
    tls: false,
    keytar: false,
  };

  /**
   * 2. Externalize Electron & Node deps
   *    This is CRITICAL
   */
  config.externals = [
    ...(config.externals || []),
    {
      electron: 'electron',
      keytar: 'commonjs2 keytar',
    },
  ];

  /**
   * 3. Provide ONLY process.env for React
   *    (nothing else)
   */
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  );

  /**
   * 4. Silence noisy warnings
   */
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    /node_modules\/pkg-up/,
    /node_modules\/path-exists/,
    /node_modules\/locate-path/,
  ];

  config.target: 'web',

  return config;
};
