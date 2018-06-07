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
  },
  pwa: {
    // name: 'My App',
    // themeColor: '#4DBA87',
    // msTileColor: '#000000',
    // appleMobileWebAppCapable: 'yes',
    // appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/firebase-messaging-sws.js'
      // ...other Workbox options...
    }
  }
}
