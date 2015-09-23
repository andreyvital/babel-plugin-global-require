/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fs = require('fs')
var path = require('path')
var generateGlobalMap = require('./generateGlobalMap.js')

var opts = {}
var config = path.resolve('.global-require')

if (fs.existsSync(config)) {
  opts = JSON.parse(fs.readFileSync(config), function(key, value) {
    return key === 'exclude' ? new RegExp(value) : value
  })
}

module.exports = function(babel) {
  var t = babel.types
  var globalMap = {}

  return new babel.Plugin('babel-plugin-global-require', {
    visitor: {
      Program: function(node, parent) {
        if (opts.root) {
          globalMap = generateGlobalMap(
            path.resolve(opts.root),
            path.resolve(opts.node_modules),
            opts.exclude
          )
        }
      },
      ImportDeclaration: function(node, parent) {
        var what = node.source.value

        if (globalMap[what]) {
          node.source.value = globalMap[what].path
        }

        return node
      },
      CallExpression: function(node, parent) {
        var isRequireCall = t.isIdentifier(node.callee, {
          name: 'require'
        })

        if (! isRequireCall) {
          return node
        }

        if (node.arguments[0] && t.isLiteral(node.arguments[0])) {
          var what = node.arguments[0].value

          if (! globalMap[what]) {
            return node
          }

          return t.callExpression(node.callee, [
            t.literal(globalMap[what].path)
          ])
        }

        return node
      }
    }
  })
}
