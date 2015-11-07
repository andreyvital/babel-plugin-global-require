var chai = require('chai')
var generateGlobalMap = require('../generateGlobalMap')
var path = require('path')
var expect = chai.expect

describe('generateGlobalMap', function(){
    var srcPath = path.resolve(__dirname,"../../example-mindeep/src/");
    var srcModules = path.resolve(__dirname,"../../example-mindeep/node_modules/");
    var mapMinDeep0 = generateGlobalMap(srcPath, srcModules, new RegExp(srcModules), 0);
    var mapMinDeep1 = generateGlobalMap(srcPath, srcModules, new RegExp(srcModules), 1);
    it('should generate file map with (minDeep = 0)', function(){
        expect(mapMinDeep0).to.have.property("OAuth1").property("name").to.equal("OAuth1");
        expect(mapMinDeep0).to.have.property("OAuth2").property("name").to.equal("OAuth2");
    })
    it('should generate file map with (minDeep = 1)', function(){
        expect(mapMinDeep1).to.have.property("dropbox/OAuth1").property("name").to.equal("dropbox/OAuth1");
        expect(mapMinDeep1).to.have.property("google/OAuth2").property("name").to.equal("google/OAuth2");
    })
});