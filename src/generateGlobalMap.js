/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var os = require('os')
var fs = require('fs')
var path = require('path')
var resolveConflict = require('./resolveConflict')
var findPotentialConflictList = require('./findPotentialConflictList')
var fetchAllFiles = require('./fetchAllFiles')
var slash = require('slash');
var pathSep = os.type() === "Windows_NT"? "/": path.sep;
function generateGlobalMap(
  root,
  node_modules,
  exclude,
  minDeep
) {
  return resolveConflict(
    fetchAllFiles(root, exclude).map(function(file) {
      var minDeepPath;
      if (minDeep>0) minDeepPath = file.split("/").slice(0,-1).slice(-minDeep)[0]; // 1

      return {
        path: slash(file),
        name: minDeep===0?path.basename(file, path.extname(file)):minDeepPath+pathSep+path.basename(file, path.extname(file))
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
