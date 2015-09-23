require('babel/register')({
  plugins: [
    require('../global-require.js')({
      root: __dirname + '/src',
      exclude: /node_modules/
    })
  ]
})

require('./index.js')
