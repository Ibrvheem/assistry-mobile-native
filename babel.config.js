// // module.exports = function (api) {
// //   api.cache(true);
// //   return {
// //     presets: ["babel-preset-expo"],
// //     plugins: ["nativewind/babel"],
// //   };
// // };


// // babel.config.js
// // module.exports = function (api) {
// //   api.cache(true);
// //   return {
// //     presets: ["babel-preset-expo"],
// //     plugins: [
// //       "react-native-reanimated/plugin"
// //     ]
// //   };
// // };

// // babel.config.js

// module.exports = function (api) {
//   api.cache(true);

//   return {
//      presets: [
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel",
//     ],
//     plugins: [    
//       [
//         '@tamagui/babel-plugin',
//         {
//           components: ['tamagui'],
//           config: './tamagui.config.ts',
//         },
//       ],
//       'react-native-reanimated/plugin',
//        'react-native-worklets/plugin',
//     ]
//   };
// };




// module.exports = function (api) {
//   api.cache(true);

//   return {
//     presets: [
//       // keep expo preset and pass jsxImportSource for nativewind
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       // ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel",
//     ],
//     plugins: [
//       // tamagui plugin (keep if you need tamagui)
//       [
//         "@tamagui/babel-plugin",
//         {
//           components: ["tamagui"],
//           config: "./tamagui.config.ts",
//         },
//       ],

//       // nativewind should be a plugin (not a preset)
//       // "nativewind/babel",

//       ["@babel/plugin-proposal-decorators", { "legacy": true }],

//       // --- put the worklets/reanimated plugin LAST ---
//       // use react-native-worklets/plugin for newer reanimated versions:
//       // "react-native-worklets/plugin"
//       // If you're using an older Reanimated that requires it, switch to:
//       "react-native-reanimated/plugin"
//     ],
//   };
// };


module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
        },
      ],

      // MUST be last, and ONLY this:
      "react-native-reanimated/plugin",
    ],
  };
};
