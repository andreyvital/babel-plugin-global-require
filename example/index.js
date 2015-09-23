var sum = require('sum')
var doSomething = require('doSomething')
import doSomethingElse from 'doSomethingElse'
import divide from 'divide'
import barConflict from 'bar/conflict'
import fooConflict from 'foo/conflict'

console.log(doSomething())
console.log(divide(10, 5))
console.log(sum(10, 10))
console.log(barConflict())
console.log(fooConflict())
