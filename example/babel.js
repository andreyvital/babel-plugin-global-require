require('babel/register')({
  plugins: [
    require('../global-require.js')({
      root: __dirname,
      exclude: /node_modules/
    })
  ]
})

require('./index.js')
