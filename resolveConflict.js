/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var path = require('path')

module.exports = function resolveConflict(map) {
  var known = findDuplicates(map)
  var solutions = []

  var without = map.filter(function(candidate) {
    return known.indexOf(candidate) === -1
  })

  known.forEach(function(current) {
    var previous = []
    var parts = path.dirname(current.path).split(path.sep)

    while (parts.length) {
      var pop = parts.pop()
      var proposal = pop.concat(path.sep, current.name)

      if (previous.length) {
        proposal = pop.concat(
          path.sep,
          previous.join(path.sep),
          path.sep,
          current.name
        )
      }

      if (! solutions[proposal]) {
        solutions[proposal] = {
          name: proposal,
          path: current.path
        }

        break
      }

      previous.push(pop)
    }
  })

  return without.concat(
    Object.keys(solutions).map(function(key) {
      return solutions[key]
    })
  )
}

function findDuplicates(arr) {
  return arr.filter(function(a, ai) {
    return arr.some(function(b, bi) {
      return a.name === b.name && ai !== bi
    })
  })
}
