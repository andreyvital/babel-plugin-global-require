var fs = require('fs')
var path = require('path')
var slash  = require('slash')
/**
 * "node_modules": "package.json" (devDependencies + dependencies)
 * "node_modules": "node_modules" (shallow scan)
 * "node_modules": ["module", "module", "module"]
 *
 * @param   {?String|String[]} node_modules
 * @returns {String[]}
 */
module.exports = function findPotentialConflictList(node_modules) {
  if (! node_modules) {
    return []
  }

  if (node_modules.constructor.name === 'Array') {
    return node_modules
  }

  if (/package\.json/.test(node_modules)) {
    try {
      var packageJson = JSON.parse(fs.readFileSync(node_modules))

      var devDependencies = packageJson.devDependencies || []
      var dependencies = packageJson.dependencies || []

      return [].concat(
        Object.keys(devDependencies),
        Object.keys(dependencies)
      )
    } catch (e) {
      return []
    }
  }

  return fs.readdirSync(node_modules).filter(function(file) {
    return fs.statSync(slash(path.join(node_modules, file))).isDirectory()
  })
}
