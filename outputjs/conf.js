"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlReporter = require('protractor-beautiful-reporter');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    suites: {
        mySuite: [
            './specs/Login-Test.js',
            './specs/PhysicianSearch-Test.js'
        ]
    },
    capabilities: {
        browserName: 'chrome'
    },
    directConnect: true,
    allScriptsTimeout: 20000,
    onPrepare: function () {
        jasmine.getEnv().addReporter(new HtmlReporter({ baseDirectory: 'Reports', preserveDirectory: false }).getJasmine2Reporter());
        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: false
            }
        }));
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 100000,
        isVerbose: true
    }
};
