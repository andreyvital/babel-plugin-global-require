var chai = require('chai')
var resolveConflict = require('../resolveConflict')
var sep = require('path').sep

var expect = chai.expect

function p(path) {
    return path.replace(/\//g, sep);
}

describe('resolveConflict', function() {
  it('resolves conflict respecting dirname', function() {
    expect(
      resolveConflict([
        {
          path: p('src/deep/sum.js'),
          name: 'sum'
        }, {
          path: p('src/deep/deep/sum.js'),
          name: 'sum'
        }, {
          path: p('src/deep/deep/divide.js'),
          name: 'divide'
        }
      ])
    ).to.eql([
      {
        path: p('src/deep/deep/divide.js'),
        name: 'divide'
      },
      {
        path: p('src/deep/sum.js'),
        name: 'deep/sum'
      }, {
        path: p('src/deep/deep/sum.js'),
        name: 'deep/deep/sum'
      }
    ])
  })

  it('resolves the conflict with the minimal required path to file', function() {
    expect(
      resolveConflict([
        {
          name: 'conflict',
          path: p('src/foo/deep/conflict.js')
        }, {
          name: 'conflict',
          path: p('src/foo/deep/bar/conflict.js')
        }, {
          name: 'conflict',
          path: p('src/foo/bar/deep/deep/conflict.js')
        }
      ])
    ).to.eql([
      {
        name: 'deep/conflict',
        path: p('src/foo/deep/conflict.js')
      }, {
        name: 'bar/conflict',
        path: p('src/foo/deep/bar/conflict.js')
      }, {
        name: 'deep/deep/conflict',
        path: p('src/foo/bar/deep/deep/conflict.js')
      }
    ])
  })

  it('resolves the conflict of multiple files', function() {
    expect(
      resolveConflict([
        {
          name: 'sum',
          path: p('src/math/sum.js')
        }, {
          name: 'sum',
          path: p('src/deep/math/sum.js')
        }, {
          name: 'sum',
          path: p('src/foo/cool/math/sum.js')
        }, {
          name: 'div',
          path: p('src/math/div.js')
        }, {
          name: 'div',
          path: p('src/deep/math/div.js')
        }, {
          name: 'div',
          path: p('src/foo/cool/math/div.js')
        }
      ])
    ).to.eql([
      {
        name: 'math/sum',
        path: p('src/math/sum.js')
      }, {
        name: 'deep/math/sum',
        path: p('src/deep/math/sum.js')
      }, {
        name: 'cool/math/sum',
        path: p('src/foo/cool/math/sum.js')
      }, {
        name: 'math/div',
        path: p('src/math/div.js')
      }, {
        name: 'deep/math/div',
        path: p('src/deep/math/div.js')
      }, {
        name: 'cool/math/div',
        path: p('src/foo/cool/math/div.js')
      }
    ])
  })

  it('takes in consideration the given "conflict map"', function() {
    expect(
      resolveConflict(
        [
          {
            name: 'sum',
            path: p('src/math/sum.js')
          }
        ],
        ['sum']
      )
    ).to.eql([
      {
        name: 'math/sum',
        path: p('src/math/sum.js')
      }
    ])
  })
})
