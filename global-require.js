var fs = require('fs')
var path = require('path')
var generateGlobalMap = require('./src/generateGlobalMap.js')

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

  return {
    visitor: {
      Program() {
        var node_modules
          = opts.node_modules ? path.resolve(opts.node_modules) : null

        if (opts.root) {
          globalMap = generateGlobalMap(path.resolve(opts.root), node_modules, opts.exclude)
        }
      },
      ImportDeclaration(path, parent) {
        var what = path.get('source').node.value

        if (globalMap[what]) {
          path.get('source').node.value = globalMap[what].path
        }
      },
      CallExpression(path, state) {
        var callee = path.get('callee')

        var isRequire = t.isIdentifier(callee.node, {
          name: 'require'
        })

        if (! isRequire) {
          return
        }

        var args = path.get('arguments')

        if (args && args.length === 0) {
          return
        }

        if (t.isStringLiteral(args[0])) {
          var what = args[0].node.value

          if (! globalMap[what]) {
            return
          }

          path.replaceWith(
            t.callExpression(callee.node, [
              t.stringLiteral(globalMap[what].path)
            ])
          )

          return
        }

        if (! t.isArrayExpression(args[0]) && t.isFunctionExpression(args[1])) {
          return
        }

        // TODO: path.replaceWith(...)
        path.node.arguments[0] = t.arrayExpression(
          args[0].node.elements.map(node => {
            return t.stringLiteral(
              globalMap[node.value] ? globalMap[node.value].path : what
            )
          })
        )
      }
    }
  }
}
