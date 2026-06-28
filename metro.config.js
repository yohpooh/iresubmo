const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// react-native-gifted-charts and gifted-charts-core ship as ESM modules.
// Metro processes node_modules as CJS by default, so we must include
// them in Babel's transform pass so the ESM syntax gets converted to CJS.
config.transformer.transformIgnorePatterns = [
  "node_modules/(?!(react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|react-native-svg|react-native-gifted-charts|gifted-charts-core)/)",
];

module.exports = withNativewind(config);
