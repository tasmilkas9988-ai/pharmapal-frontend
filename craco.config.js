const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Disable caching in development to prevent stale content
      if (webpackConfig.mode === 'development') {
        webpackConfig.cache = false;
      }

      return webpackConfig;
    },
  },
  devServer: {
    allowedHosts: 'all',
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
  },
};