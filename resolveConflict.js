/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var path = require('path')

var PATH_SEP = path.sep

module.exports = function resolveConflict(
  map,
  potentialConflictMap
) {
  var known = findConflictsInMap(map)
  var solutions = []

  known = known.concat(
    map.filter(function(candidate) {
      return (potentialConflictMap || []).indexOf(candidate.name) !== -1
    })
  )

  known.forEach(function(current) {
    var previous = []
    var parts = path.dirname(current.path).split(PATH_SEP)

    while (parts.length) {
      var pop = parts.pop()
      var proposal = pop.concat(PATH_SEP, current.name)

      if (previous.length) {
        proposal = pop.concat(
          PATH_SEP,
          previous.join(PATH_SEP),
          PATH_SEP,
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

  return map.filter(function(candidate) {
    return known.indexOf(candidate) === -1
  }).concat(
    Object.keys(solutions).map(function(key) {
      return solutions[key]
    })
  )
}

/**
 * @param   {Object[]} map
 * @returns {Object[]}
 */
function findConflictsInMap(map) {
  return map.filter(function(module, moduleIndex) {
    return map.some(function(conflict, conflictIndex) {
      return (
        module.name === conflict.name &&
        moduleIndex !== conflictIndex
      )
    })
  })
}
