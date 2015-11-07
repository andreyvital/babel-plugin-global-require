/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fs = require('fs')
var path = require('path')
var generateGlobalMap = require('./src/generateGlobalMap.js')
var slash = require('slash')
var opts = {}
var config = slash(path.resolve('.global-require'))


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
          = opts.node_modules ? slash(path.resolve(opts.node_modules)) : null
        if (opts.root) {
          globalMap = generateGlobalMap(
            path.resolve(opts.root),
            node_modules,
            opts.exclude,
            parseInt(opts.minDeep || 0)
          );
        }
      },
      ImportDeclaration: function(node, parent) {
        var what = node.source.value

        if (globalMap[what]) {
          node.source.value = slash(globalMap[what].path)
          // refs #2
          // node.source.value = './' + path.relative(cwd, globalMap[what].path)
        }

        return node
      },
      CallExpression: function(node, parent) {
        if (! t.isIdentifier(node.callee, { name: 'require' })) {
          return node
        }

        var args = node.arguments

        if (args && args.length === 0) {
          return node
        }

        // CommonJS
        if (t.isLiteral(args[0])) {
          var what = args[0].value

          if (! globalMap[what]) {
            return node
          }

          return t.callExpression(node.callee, [
            t.literal(globalMap[what].path)
          ])
        }

        if (! t.isArrayExpression(args[0]) && t.isFunctionExpression(args[1])) {
          return node
        }

        return t.callExpression(node.callee, [
          t.arrayExpression(
            args[0].elements.map(function(node) {
              var what = node.value

              return t.literal(
                globalMap[what] ? globalMap[what].path : what
              )
            })
          ),
          args[1]
        ])
      }
    }
  })
}
