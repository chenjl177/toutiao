const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://toutiao.itheima.net/',
        ws: true,
        changeOrigin: true
      },
      'sockjs-node': {
        target: 'http://toutiao.itheima.net/',
        ws: false,
        changeOrigin: true
      }
    }
  }
}

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
