"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
var protractor_1 = require("protractor");
var HomePage = /** @class */ (function () {
    function HomePage() {
    }
    HomePage.prototype.VerifyPageOpen = function () {
        protractor_1.browser.waitForAngularEnabled(false);
        protractor_1.browser.get("https://demo.clickdoc.de");
        protractor_1.browser.waitForAngular();
        expect(protractor_1.browser.getTitle()).toContain("CLICKDOC");
        protractor_1.browser.sleep(3000);
        (0, protractor_1.element)(protractor_1.by.xpath('/html/body/app-root/div[2]/app-consent-gdpr-container/app-modal-wrapper/div/div[2]/div[3]/button[1]')).click();
    };
    return HomePage;
}());
exports.HomePage = HomePage;
