module.exports = {
  watch: true,
  entry: './index.js',
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel',
        query: {
          stage: 0,
          plugins: [
            '../global-require'
          ]
        }
      }
    ]
  }
}
