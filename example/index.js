//var resolveConflict = require('../src/resolveConflict')
//console.log(resolveConflict([
//    {
//        name: 'conflict',
//        path: 'src/foo/deep/conflict.js'
//    }, {
//        name: 'conflict',
//        path: 'src/foo/deep/bar/conflict.js'
//    }, {
//        name: 'conflict',
//        path: 'src/foo/bar/deep/deep/conflict.js'
//    }
//]))
//
//var fetchAllFiles = require('../src/fetchAllFiles')
//
//console.log(fetchAllFiles("./"));

var sum = require('sum')
var doSomething = require('doSomething')
require('bar/conflict');
require('foo/conflict');
import doSomethingElse from 'doSomethingElse'
import divide from 'divide'
import barConflict from 'bar/conflict'
import fooConflict from 'foo/conflict'

console.log(doSomething())
console.log(divide(10, 5))
console.log(sum(10, 10))
console.log(barConflict())
console.log(fooConflict())
