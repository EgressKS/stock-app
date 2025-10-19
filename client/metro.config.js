const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    sourceExts: [...config.resolver.sourceExts, 'jsx', 'js', 'json', 'ts', 'tsx'],
    assetExts: [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif'],
  },
};