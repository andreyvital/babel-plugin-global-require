/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fs = require('fs')
var path = require('path')

module.exports = function generateGlobalMap(root) {
  return fetchAllFiles(root).map(function(file) {
    return {
      path: file,
      name: path.basename(file, path.extname(file))
    }
  }).reduce(
    function(previous, current) {
      if (! previous[current.name]) {
        previous[current.name] = current
      }

      return previous
    },
    {}
  )
}

/**
 * @param   {String} root
 * @returns {String[]}
 */
function fetchAllFiles(root) {
  var results = []

  fs.readdirSync(root).forEach(function(file) {
    var absolute = path.join(root, file)
    var stat = fs.statSync(absolute)

    if (stat.isDirectory()) {
      results = results.concat(fetchAllFiles(absolute))
      return
    }

    results.push(absolute)
  })

  return results
}
