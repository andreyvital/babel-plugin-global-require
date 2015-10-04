/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
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
  // var cwd = process.cwd()

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
      ImportDeclaration: function(node, parent) {
        var what = node.source.value

        if (globalMap[what]) {
          node.source.value = globalMap[what].path
          // refs #2
          // node.source.value = './' + path.relative(cwd, globalMap[what].path)
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

        if (node.arguments && node.arguments.length === 0) {
          return node
        }

        // CommonJS
        if (t.isLiteral(node.arguments[0])) {
          var what = node.arguments[0].value

          if (! globalMap[what]) {
            return node
          }

          return t.callExpression(node.callee, [
            t.literal(globalMap[what].path)
          ])
        }

        // AMD
        if (t.isArrayExpression(node.arguments[0]) && t.isFunctionExpression(node.arguments[1])) {
          return t.callExpression(node.callee, [
            t.arrayExpression(
              node.arguments[0].elements.map(function(node) {
                var what = node.value

                return t.literal(globalMap[what] ? globalMap[what].path : what)
              })
            ),
            node.arguments[1]
          ])
        }

        return node
      }
    }
  })
}
