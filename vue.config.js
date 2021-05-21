const ModuleDependency = require('./plugins/ModuleDependency')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000'
      },
    }
  },
  chainWebpack: (config) => {
    isProd && config.plugin('moduleDependency')
      .use(ModuleDependency, [{
        projectName: 'my-app',
        packageName: '@lx-vue-materiel'
      }])
  }
}