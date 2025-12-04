module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This is the critical missing piece for animations
      'react-native-reanimated/plugin',
    ],
  };
};