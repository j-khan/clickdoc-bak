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
    /* Verify Home page is loaded successfully */
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
    it("Login with valid Email only", function () {
        loginPage.ValidEmail('junaidkhan.z@hotmail.com'); /* Login attempt using only with Email */
    });
    it("Login with Valid Email and Incorrect password ", function () {
        loginPage.ValidEmailAndNonEmptyPassword('junaidkhan.z@hotmail.com', '„abcdefg"'); /* Login attempt with valid email and invalid password */
    });
    it("Login is Invalid Credential", function () {
        loginPage.InvalidCredentials('dirk.nonn@cgm.com#1111', '„abcdedsffg"'); /* Invalid Login attempt */
    });
    it("Login with Valid Credential", function () {
        loginPage.ValidCredentials('junaidkhan.z@hotmail.com', 'Test123@'); /* Login with Valid Credentials */
    });
    // it("Verify logout ", function () { /* Logout Using profile Link */
    //   loginPage.LogOut();
    // })
});
