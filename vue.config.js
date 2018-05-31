var manifestJSON = require('./public/manifest.json')

const pwaArgs = {
  themeColor: manifestJSON.theme_color,
  name: manifestJSON.short_name,
  msTileColor: '#BA68C8',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: '#4A148C'
}

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.plugin('pwa').tap(args => {
      return [pwaArgs]
    })
  }
}
