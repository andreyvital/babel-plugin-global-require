var path = require('path')

/**
 * @param   {Object[]} map
 * @param   {String[]} [potentialConflictMap]
 * @returns {Object[]}
 */
module.exports = function resolveConflict(
  map,
  potentialConflictMap
) {
  var known = findConflictsInMap(fixIndexImportsInMap(map))
  var resolved = resolveConflictsInMap(known)

  if (potentialConflictMap && potentialConflictMap.length) {
    var resolvedNames = resolved.map(function(candidate) {
      return candidate.name
    })

    var conflictNames = potentialConflictMap.filter(function(name) {
      return resolvedNames.indexOf(name) === -1
    })

    var unresolved = map.filter(function(candidate) {
      return conflictNames.indexOf(candidate.name) !== -1
    })

    map = resolveConflictsInMap(
      unresolved,
      resolvedNames.concat(conflictNames)
    ).concat(resolved)
  }

  return map.filter(function(candidate) {
    return known.indexOf(candidate) === -1
  }).concat(resolved)
}

/**
 * @param {Object[]} map
 * @returns {Array}
 */
function fixIndexImportsInMap(map) {
  return map.map(function(obj) {
    var basename = path.basename(obj.path)

    if (basename === 'index.js') {
      var moduleName = obj.path.split('.')[0].split(path.sep)
      obj.name = moduleName[moduleName.length - 2]
    }

    return obj
  })
}

/**
 * @param {Object[]} map
 * @param {String[]} [reservedNames]
 * @returns {Object[]}
 */
function resolveConflictsInMap(map, reservedNames) {
  reservedNames = reservedNames || []

  return map.map(function(current) {
    var previous = []
    var parts = path.dirname(current.path).split(path.sep)

    if (path.basename(current.path) === 'index.js') {
      parts = parts.splice(0, parts.length - 1)
    }

    while (parts.length) {
      var pop = parts.pop()
      var proposal

      if (previous.length) {
        proposal = [pop].concat(previous, current.name).join('/')
      } else {
        proposal = pop.concat('/', current.name)
      }

      if (reservedNames.indexOf(proposal) === -1) {
        reservedNames.push(proposal)
        current.name = proposal
        break
      }

      previous.unshift(pop)
    }

    return current
  })
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
