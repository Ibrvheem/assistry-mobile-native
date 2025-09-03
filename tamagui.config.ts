// // tamagui.config.ts
// import { createTamagui } from 'tamagui';

// /**
//  * Robust Tamagui config that:
//  *  - tries to load @tamagui/config/v3 via require (works around ESM/runtime Metro issues)
//  *  - falls back to a minimal, sane tokens set when the package is not available
//  */

// const fallbackSize = {
//   '1': 4,
//   '2': 6,
//   '3': 8,
//   '4': 10,
//   '5': 12,
//   '6': 14,
//   '7': 16,
//   '8': 20,
//   '9': 24,
//   '10': 32,
// };

// const fallbackTokens = {
//   color: {
//     background: '#ffffff',
//     foreground: '#111111',
//     primary: '#1C332B',
//     muted: '#6c757d',
//   },
//   size: fallbackSize,
//   space: {
//     '1': 4,
//     '2': 8,
//     '3': 12,
//     '4': 16,
//     '5': 20,
//   },
// };

// let defaultConfig: any = {};
// try {
//   // Use require inside try/catch because Metro + ESM default imports can evaluate to undefined
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const cfg = require('@tamagui/config/v3');
//   // Some builds export the config as default, some as module.exports
//   defaultConfig = cfg?.default ?? cfg ?? {};
// } catch (err) {
//   // package not available at runtime in the RN bundler — continue with fallbackTokens below
//   defaultConfig = {};
// }

// // Safely obtain tokens and media from defaultConfig or fallbacks
// const defaultTokens = (defaultConfig && defaultConfig.tokens) || {};
// const tokens = {
//   ...fallbackTokens,
//   ...defaultTokens,
//   // ensure size exists (highest priority is defaultConfig.tokens.size if present)
//   size: defaultTokens.size ?? fallbackTokens.size,
// };

// const media = (defaultConfig && defaultConfig.media) ?? {
//   short: { maxHeight: 600 },
//   sm: { maxWidth: 660 },
//   md: { maxWidth: 860 },
//   lg: { maxWidth: 1280 },
//   xl: { maxWidth: 1600 },
//   hover: ({ hover: true } as any),
// };

// // const themes = (defaultConfig && defaultConfig.themes) ?? {
// //   light: {
// //     background: tokens.color?.background ?? '#fff',
// //     color: tokens.color?.foreground ?? '#111',
// //   },
// //   dark: {
// //     background: '#000',
// //     color: '#fff',
// //   },
// // };

// const config = createTamagui({
//   // keep any existing theme/tokens when possible, but never crash
//   tokens,
//   // themes,
//   media,
// });

// export type AppConfig = typeof config;

// declare module 'tamagui' {
//   interface TamaguiCustomConfig extends AppConfig {}
// }

// export default config;




import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
const animations = require('@tamagui/animations-react-native');


const config = createTamagui({
  themes,
  tokens,
  shorthands,
  animations,
  shouldExtract: false, 
})

export type AppConfig = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config


