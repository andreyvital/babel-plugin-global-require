var chai = require('chai')
var resolveConflict = require('../resolveConflict')
var path = require('path')

var expect = chai.expect
var sep = path.sep

function p(path) {
    return path.replace(/\//g, sep);
}

describe('resolveConflict', function() {
  it('resolves conflict respecting dirname', function() {
    expect(
      resolveConflict([
        {
          name: 'sum',
          path: p('src/deep/sum.js')
        }, {
          name: 'sum',
          path: p('src/deep/deep/sum.js')
        }, {
          name: 'divide',
          path: p('src/deep/deep/divide.js')
        }, {
          name: 'index',
          path: p('src/deep/deep/divide/index.js')
        }
      ])
    ).to.eql([
      {
        name: 'deep/sum',
        path: p('src/deep/sum.js')
      }, {
        name: 'deep/deep/sum',
        path: p('src/deep/deep/sum.js')
      },
      {
        name: 'deep/divide',
        path: p('src/deep/deep/divide.js')
      },
      {
        name: 'deep/deep/divide',
        path: p('src/deep/deep/divide/index.js')
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
        }, {
          name: 'index',
          path: p('src/foo/bar/baz/deep/deep/conflict/index.js')
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
      }, {
        name: 'baz/deep/deep/conflict',
        path: p('src/foo/bar/baz/deep/deep/conflict/index.js')
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
          name: 'index',
          path: p('src/foo/cool/math/sum/index.js')
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
        name: 'foo/cool/math/sum',
        path: p('src/foo/cool/math/sum/index.js')
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
            path: p('src/sum.js')
          }, {
            name: 'index',
            path: p('src/sum/index.js')
          }, {
            name: 'index',
            path: p('src/bar/divide/index.js')
          }
        ],
        ['sum', 'divide']
      )
    ).to.eql([
      {
        name: 'bar/divide',
        path: p('src/bar/divide/index.js')
      }, {
        name: 'src/sum',
        path: p('src/sum.js')
      }, {
        name: 'sum',
        path: p('src/sum/index.js')
      }
    ])
  })

  it('resolves conflicts with multiple index.js', function() {
    expect(
      resolveConflict([
        {
          name: 'index',
          path: p('src/deep/sum/index.js')
        }, {
          name: 'index',
          path: p('src/deep/deep/sum/index.js')
        }, {
          name: 'index',
          path: p('src/deep/deep/divide/index.js')
        }
      ])
    ).to.eql([
      {
        name: 'divide',
        path: p('src/deep/deep/divide/index.js')
      }, {
        name: 'deep/sum',
        path: p('src/deep/sum/index.js')
      }, {
        name: 'deep/deep/sum',
        path: p('src/deep/deep/sum/index.js')
      }
    ])
  })
})
