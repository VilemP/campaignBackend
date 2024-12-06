const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

module.exports = composePlugins(withNx(), (config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@libs': path.resolve(__dirname, '../../libs'),
        '@campaign-backend': path.resolve(__dirname, './src')
      }
    }
  };
}); 