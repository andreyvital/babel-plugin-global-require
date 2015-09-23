require('babel/register')({
  plugins: [
    require('../global-require.js')({
      root: __dirname + '/src',
      exclude: /node_modules/,
      node_modules: __dirname + '/node_modules'
    })
  ]
})

require('./index.js')
