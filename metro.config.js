// // metro.config.js
// const { getDefaultConfig } = require("expo/metro-config");
// const config = getDefaultConfig(__dirname);

// config.transformer = config.transformer || {};
// config.transformer.enableBabelRCLookup = false;

// module.exports = config;


const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)
 
module.exports = withNativeWind(config, { input: './global.css' })