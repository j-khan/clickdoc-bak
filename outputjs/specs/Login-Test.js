"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var LoginPage_1 = require("../Pages/LoginPage");
var HomePage_1 = require("../Pages/HomePage");
describe('UI Automation testing of ClickDOc Application', function () {
    var openBasePage = new HomePage_1.HomePage();
    var loginPage = new LoginPage_1.LoginPage();
    beforeEach(function () {
        protractor_1.browser.waitForAngularEnabled(false);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });
    it('Verify Page Title', function () {
        openBasePage.VerifyPageOpen();
    });
    it("Open Login Page", function () {
        loginPage.OpenLoginWindow();
    });
    it('Verify Login Page Element', function () {
        loginPage.VerifyElementPresentOnLoginPage();
    });
    it("Login with Empty Credentials", function () {
        loginPage.LoginReject();
    });
    it("Login with valid e-mail", function () {
        loginPage.ValidEmail('dirk.nonn@cgm.com#1111');
    });
    it("Login with Valid Email and Wrong password ", function () {
        loginPage.ValidEmailAndNonEmptyPassword('dirk.nonn@cgm.com#1111', '„abcdefg"');
    });
    it("Login is Invalid Credential", function () {
        loginPage.InvalidCredentials('dirk.nonn@cgm.com#1111', '„abcdefg"');
    });
    it("Logi with Valid Credential", function () {
        loginPage.ValidCredentials('dirk.nonn@cgm.com#1111', 'recruitingTest1!');
    });
    it("Verify logout ", function () {
        loginPage.LogOut();
    });
});
