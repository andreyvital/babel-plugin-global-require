/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var generateGlobalMap = require('./generateGlobalMap.js')

module.exports = function(opts) {
  var globalMap = {}

  if (opts.root) {
    globalMap = generateGlobalMap(opts.root)
  }

  return function(babel) {
    var t = babel.types

    return new babel.Plugin('babel-plugin-global-require', {
      visitor: {
        ImportDeclaration: function(node, parent) {
          var what = node.source.value

          if (globalMap[what]) {
            node.source.value = globalMap[what].path
          }

          return node
        },
        CallExpression: function(node, parent) {
          if (! isRequireCall(t, node)) {
            return
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
}

function isRequireCall(t, call) {
  return t.isIdentifier(call.callee, {
    name: 'require'
  })
}
