require('babel/register')({
  plugins: [
    require('../global-require.js')({
      root: __dirname
    })
  ]
})

require('./index.js')
