/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fs = require('fs')
var path = require('path')

module.exports = function generateGlobalMap(root, exclude) {
  return fetchAllFiles(root, exclude).map(function(file) {
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
 * @param   {RegExp} exclude
 * @returns {String[]}
 */
function fetchAllFiles(root, exclude) {
  var results = []

  fs.readdirSync(root).filter(function(file) {
    if (exclude && exclude.test(file)) {
      return false
    }

    return true
  }).forEach(function(file) {
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
