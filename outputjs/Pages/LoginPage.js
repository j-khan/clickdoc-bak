"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
var protractor_1 = require("protractor");
var LoginPage = /** @class */ (function () {
    function LoginPage() {
        this.Email = (0, protractor_1.element)(protractor_1.by.id('mat-input-1'));
        this.EmailError = (0, protractor_1.element)(protractor_1.by.id('mat-error-0'));
        this.Password = (0, protractor_1.element)(protractor_1.by.id('mat-input-2'));
        this.CloseIcon = (0, protractor_1.element)(protractor_1.by.xpath('/html/body/app-iframe-dialog/div/div/div/span'));
        this.RegistrationButton = (0, protractor_1.element)(protractor_1.by.className('life-secondary-btn ng-star-inserted'));
        this.ForgotPasswordButton = (0, protractor_1.element)(protractor_1.by.className('bold small'));
        this.LoginButton = (0, protractor_1.element)(protractor_1.by.css('body > app-root > div > div > main > app-login > form > div.content > div > div > div.d-none.d-sm-block.buttons > button.life-primary-btn'));
        this.InvalidCredentialsMessage = (0, protractor_1.element)(protractor_1.by.xpath('/html/body/app-root/div/div/main/app-login/form/div[1]/div/div/app-error-message/div/div[1]/p'));
        this.ProfileLink = (0, protractor_1.element)(protractor_1.by.linkText('Profil'));
        this.AccountProfileLink = (0, protractor_1.element)(protractor_1.by.xpath('/html/body/app-root/div[2]/div/app-header/div/div/div/div[2]/ul/li[5]/a/div/span'));
        this.LogOutLink = (0, protractor_1.element)(protractor_1.by.xpath('/html/body/app-root/div[2]/div/app-header/div/div/div/div[2]/ul/li[5]/div/div/a[2]/div/span[2]/font/font'));
    }
    LoginPage.prototype.VerifyElementPresentOnLoginPage = function () {
        //browser.sleep(5000);
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
        protractor_1.browser.sleep(3000);
    };
    LoginPage.prototype.CheckInValidEmail = function () {
        expect(this.EmailError.getText()).toContain('Bitte geben Sie Ihre E-Mail-Adresse ein.');
    };
    LoginPage.prototype.CheckInvalidPassword = function () {
        expect(this.Password.getAttribute("ng-invalid"));
    };
    LoginPage.prototype.LoginReject = function () {
        protractor_1.browser.switchTo().frame(protractor_1.browser.findElement(protractor_1.protractor.By.id('iframeDialog')));
        //browser.sleep(5000);
        this.LoginCmd();
        protractor_1.browser.sleep(3000);
        this.CheckInValidEmail();
        this.CheckInvalidPassword();
    };
    LoginPage.prototype.ValidEmail = function (var_args) {
        this.SetEmail(var_args);
        expect((0, protractor_1.element)(protractor_1.by.id('mat-input-1')).getAttribute("ng-valid"));
        expect((0, protractor_1.element)(protractor_1.by.id('mat-input-2')).getAttribute("ng-invalid"));
    };
    ;
    LoginPage.prototype.ValidEmailAndNonEmptyPassword = function (email, password) {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginCmd();
        protractor_1.browser.sleep(2000);
        expect(this.InvalidCredentialsMessage.getText()).toContain('Bitte überprüfen Sie Ihre Eingaben und probieren Sie es erneut. Haben Sie noch keine CGM LIFE ID?');
        //expect(element(by.id('mat-input-1')).getAttribute("ng-valid"));
        //expect(element(by.id('mat-input-2')).getAttribute("ng-invalid"));
    };
    ;
    LoginPage.prototype.InvalidCredentials = function (email, password) {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        protractor_1.browser.sleep(5000);
        expect(this.InvalidCredentialsMessage.isPresent());
    };
    ;
    LoginPage.prototype.ValidCredentials = function (email, password) {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        protractor_1.browser.sleep(8000);
        this.AccountProfileLink.click();
        expect(this.LogOutLink.isPresent());
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
