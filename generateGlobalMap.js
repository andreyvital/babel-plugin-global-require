/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fs = require('fs')
var path = require('path')
var resolveConflict = require('./resolveConflict')

module.exports = function generateGlobalMap(
  root,
  node_modules,
  exclude
) {
  return resolveConflict(
    fetchAllFiles(root, exclude).map(function(file) {
      return {
        path: file,
        name: path.basename(file, path.extname(file))
      }
    }),
    node_modules ? findNodeModules(node_modules) : []
  ).reduce(
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
 * @param   {String} node_modules
 * @returns {String[]}
 */
function findNodeModules(node_modules) {
  return fs.readdirSync(node_modules).filter(function(file) {
    var target = path.join(node_modules, file)

    if (fs.statSync(target).isDirectory()) {
      return true
    }

    return false
  })
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
