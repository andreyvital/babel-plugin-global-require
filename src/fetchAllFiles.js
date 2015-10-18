/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fs = require('fs')
var path = require('path')
var slash = require('slash')
/**
 * @param   {String} root
 * @param   {RegExp} exclude
 * @returns {String[]}
 */
module.exports = function fetchAllFiles(root, exclude) {
  var results = []

  fs.readdirSync(root).filter(function(file) {
    return exclude && exclude.test(file) ? false : true
  }).forEach(function(file) {
    var absolute = slash(path.join(root, file)).toString()
    var stat = fs.statSync(absolute)

    if (stat.isDirectory()) {
      results = results.concat(fetchAllFiles(absolute))
      return
    }

    results.push(slash(absolute).toString())
  })

  return results
}
