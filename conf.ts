import {Config, browser} from "protractor"
var HtmlReporter = require('protractor-beautiful-reporter');
let SpecReporter= require('jasmine-spec-reporter').SpecReporter;

export let config: Config={
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    suites : {
      mySuite: [
          './specs/Login-Test.js',
         //'./specs/PhysicianSearch-Test.js'
      ]},
    capabilities: {
      browserName: 'chrome'
    },
    directConnect: true,
    allScriptsTimeout: 20000,

    onPrepare : ()=>{
        jasmine.getEnv().addReporter(new HtmlReporter({baseDirectory:'Reports',preserveDirectory: false}).getJasmine2Reporter());
        jasmine.getEnv().addReporter(new SpecReporter({
          spec: {
              displayStacktrace: false
          }
      }))
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 100000,
        isVerbose: true
         }

}