module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
        "module:react-native-dotenv",
        {
            moduleName: "@env",
            path: ".env",
            allowlist: ['REACT_APP_NODE_URL']
        },
    ],
    'react-native-reanimated/plugin'
],
};
