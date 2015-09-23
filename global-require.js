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
    if (key === 'exclude' && value.length) {
      return new RegExp(value)
    }

    return value
  })
}

module.exports = function(babel) {
  var t = babel.types
  var globalMap = {}

  return new babel.Plugin('babel-plugin-global-require', {
    visitor: {
      Program: function(node, parent) {
        var node_modules
          = opts.node_modules ? path.resolve(opts.node_modules) : null

        if (opts.root) {
          globalMap = generateGlobalMap(
            path.resolve(opts.root),
            node_modules,
            opts.exclude
          )
        }
      },
      ImportDeclaration: function(node, parent, scope, file) {
        var what = node.source.value

        if (globalMap[what]) {
          // GitHub refs:#2
          // node.source.value = './' + path.relative(
          //   path.dirname(
          //     path.resolve(file.opts.filename)
          //   ),
          //   globalMap[what].path
          // )

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
