/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fs = require('fs')
var path = require('path')
var resolveConflict = require('./resolveConflict')
var findPotentialConflictList = require('./findPotentialConflictList')
var fetchAllFiles = require('./fetchAllFiles')
var slash = require('slash');
function generateGlobalMap(
  root,
  node_modules,
  exclude
) {
  return resolveConflict(
    fetchAllFiles(root, exclude).map(function(file) {
      return {
        path: slash(file),
        name: path.basename(file, path.extname(file))
      }
    }),
    findPotentialConflictList(node_modules)
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

module.exports = generateGlobalMap
