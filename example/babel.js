require('babel/register')({
  plugins: [
    require('../global-require.js')
  ]
})

require('./index.js')
