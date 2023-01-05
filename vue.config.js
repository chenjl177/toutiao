const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// const path = require('path')

// const coverPath = path.join(__dirname, './src/cover.less')

// module.exports = {
//   css: {
//     loaderOptions: {
//       less: {
//         lessOptions: {
//           modifyVars: {
//             hack: `true; @import "${coverPath}";`
//           }
//         }
//       }
//     }
//   }
// }
