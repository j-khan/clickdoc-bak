"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var HomePage = /** @class */ (function () {
    function HomePage() {
    }
    HomePage.prototype.VerifyPageOpen = function () {
        protractor_1.browser.waitForAngularEnabled(false);
        protractor_1.browser.get("https://demo.clickdoc.de");
        protractor_1.browser.waitForAngular();
        expect(protractor_1.browser.getTitle()).toContain("CLICKDOC");
    };
    return HomePage;
}());
exports.HomePage = HomePage;
