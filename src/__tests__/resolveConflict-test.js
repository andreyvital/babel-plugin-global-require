/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var chai = require('chai')
var resolveConflict = require('../resolveConflict')

var expect = chai.expect

describe('resolveConflict', function() {
  it('resolves conflict respecting dirname', function() {
    expect(
      resolveConflict([
        {
          path: 'src/deep/sum.js',
          name: 'sum'
        }, {
          path: 'src/deep/deep/sum.js',
          name: 'sum'
        }, {
          path: 'src/deep/deep/divide.js',
          name: 'divide'
        }
      ])
    ).to.eql([
      {
        path: 'src/deep/deep/divide.js',
        name: 'divide'
      },
      {
        path: 'src/deep/sum.js',
        name: 'deep/sum'
      }, {
        path: 'src/deep/deep/sum.js',
        name: 'deep/deep/sum'
      }
    ])
  })

  it('resolves the conflict with the minimal required path to file', function() {
    expect(
      resolveConflict([
        {
          name: 'conflict',
          path: 'src/foo/deep/conflict.js'
        }, {
          name: 'conflict',
          path: 'src/foo/deep/bar/conflict.js'
        }, {
          name: 'conflict',
          path: 'src/foo/bar/deep/deep/conflict.js'
        }
      ])
    ).to.eql([
      {
        name: 'deep/conflict',
        path: 'src/foo/deep/conflict.js'
      }, {
        name: 'bar/conflict',
        path: 'src/foo/deep/bar/conflict.js'
      }, {
        name: 'deep/deep/conflict',
        path: 'src/foo/bar/deep/deep/conflict.js'
      }
    ])
  })

  it('resolves the conflict of multiple files', function() {
    expect(
      resolveConflict([
        {
          name: 'sum',
          path: 'src/math/sum.js'
        }, {
          name: 'sum',
          path: 'src/deep/math/sum.js'
        }, {
          name: 'sum',
          path: 'src/foo/cool/math/sum.js'
        }, {
          name: 'div',
          path: 'src/math/div.js'
        }, {
          name: 'div',
          path: 'src/deep/math/div.js',
        }, {
          name: 'div',
          path: 'src/foo/cool/math/div.js'
        }
      ])
    ).to.eql([
      {
        name: 'math/sum',
        path: 'src/math/sum.js'
      }, {
        name: 'deep/math/sum',
        path: 'src/deep/math/sum.js'
      }, {
        name: 'cool/math/sum',
        path: 'src/foo/cool/math/sum.js'
      }, {
        name: 'math/div',
        path: 'src/math/div.js'
      }, {
        name: 'deep/math/div',
        path: 'src/deep/math/div.js',
      }, {
        name: 'cool/math/div',
        path: 'src/foo/cool/math/div.js'
      }
    ])
  })

  it('takes in consideration the given "conflict map"', function() {
    expect(
      resolveConflict(
        [
          {
            name: 'sum',
            path: 'src/math/sum.js'
          }
        ],
        ['sum']
      )
    ).to.eql([
      {
        name: 'math/sum',
        path: 'src/math/sum.js'
      }
    ])
  })

  it('resolves conflict relative to root')
})
