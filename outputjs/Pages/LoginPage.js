"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var LoginPage = /** @class */ (function () {
    function LoginPage() {
        this.Email = protractor_1.element(protractor_1.by.xpath('//*[@id="mat-input-0"]'));
        this.Password = protractor_1.element(protractor_1.by.xpath('//*[@id="mat-input-1"]'));
        this.CloseIcon = protractor_1.element(protractor_1.by.xpath('/html/body/app-iframe-dialog/div/div/div/span'));
        this.RegistrationButton = protractor_1.element(protractor_1.by.className('life-btn life-secondary-btn'));
        this.ForgotPasswordButton = protractor_1.element(protractor_1.by.className('link margin-top-15'));
        this.LoginButton = protractor_1.element(protractor_1.by.xpath('/html/body/app-root/div/div/main/app-login/div/div[1]/div/div/div[2]/div[2]/div[2]/button'));
        this.InvalidCredentialsMessage = protractor_1.element(protractor_1.by.xpath('/html/body/app-root/div/div/main/app-login/div/div[1]/div/div/div[2]/div[1]/div[1]/div/app-error-message/div'));
        this.ProfileLink = protractor_1.element(protractor_1.by.linkText('Profil'));
        this.AccountProfileLink = protractor_1.element(protractor_1.by.xpath('/html/body/app-root/div[2]/app-header/div/div[2]/div/div[2]/ul/li[7]/a/app-avatar/div'));
        this.LogOutLink = protractor_1.element(protractor_1.by.xpath('/html/body/app-root/div[2]/app-header/div/div[2]/div/div[2]/ul/li[7]/div/div/a[2]/div/span[2]'));
    }
    LoginPage.prototype.VerifyElementPresentOnLoginPage = function () {
        expect(this.CloseIcon.isPresent());
        expect(this.Email.isPresent());
        expect(this.Password.isPresent());
        expect(this.ForgotPasswordButton.isPresent());
        expect(this.RegistrationButton.isPresent());
        expect(this.LoginButton.isPresent());
    };
    LoginPage.prototype.SetEmail = function (var_args) {
        this.Email.clear();
        this.Email.sendKeys(var_args);
    };
    ;
    LoginPage.prototype.SetPassword = function (var_args) {
        this.Password.clear();
        this.Password.sendKeys(var_args);
    };
    ;
    LoginPage.prototype.LoginCmd = function () {
        this.LoginButton.click();
    };
    LoginPage.prototype.OpenLoginWindow = function () {
        protractor_1.browser.driver.manage().window().maximize();
        this.ProfileLink.click();
        protractor_1.browser.sleep(15000);
    };
    LoginPage.prototype.CheckInValidEmail = function () {
        expect(this.Email.getAttribute("ng-invalid"));
    };
    LoginPage.prototype.CheckInvalidPassword = function () {
        expect(this.Password.getAttribute("ng-invalid"));
    };
    LoginPage.prototype.LoginReject = function () {
        protractor_1.browser.switchTo().frame(protractor_1.browser.findElement(protractor_1.protractor.By.id('iframeDialog')));
        protractor_1.browser.sleep(15000);
        this.LoginCmd();
        this.CheckInValidEmail();
        this.CheckInvalidPassword();
    };
    LoginPage.prototype.ValidEmail = function (var_args) {
        this.SetEmail(var_args);
        expect(protractor_1.element(protractor_1.by.xpath('//*[@id="mat-input-0"]')).getAttribute("ng-valid"));
        expect(protractor_1.element(protractor_1.by.xpath('//*[@id="mat-input-1"]')).getAttribute("ng-invalid"));
    };
    ;
    LoginPage.prototype.ValidEmailAndNonEmptyPassword = function (email, password) {
        this.SetEmail(email);
        this.SetPassword(password);
        expect(protractor_1.element(protractor_1.by.xpath('//*[@id="mat-input-0"]')).getAttribute("ng-valid"));
        expect(protractor_1.element(protractor_1.by.xpath('//*[@id="mat-input-1"]')).getAttribute("ng-invalid"));
    };
    ;
    LoginPage.prototype.InvalidCredentials = function (email, password) {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        protractor_1.browser.sleep(10000);
        expect(this.InvalidCredentialsMessage.isPresent());
    };
    ;
    LoginPage.prototype.ValidCredentials = function (email, password) {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        protractor_1.browser.sleep(10000);
    };
    ;
    LoginPage.prototype.LogOut = function () {
        protractor_1.browser.sleep(10000);
        this.AccountProfileLink.click();
        protractor_1.browser.sleep(10000);
        this.LogOutLink.click();
        protractor_1.browser.sleep(10000);
    };
    return LoginPage;
}());
exports.LoginPage = LoginPage;
