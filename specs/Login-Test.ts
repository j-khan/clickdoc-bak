import { browser, element, by, protractor } from "protractor"

import{LoginPage} from "../Pages/LoginPage"
import { HomePage } from "../Pages/HomePage";

describe('UI Automation testing of ClickDOc Application', function(){
  let openBasePage = new HomePage();
  let loginPage = new LoginPage();
  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  })
  it('Verify Page Title',function(){
    openBasePage.VerifyPageOpen();
  })
  it("Open Login Page",  function(){
    loginPage.OpenLoginWindow();
  })
  it("Login with Empty Credentials", function () {
    loginPage.LoginReject();
  })
  it("Login with valid e-mail", function () {
    loginPage.ValidEmail('dirk.nonn@cgm.com#1111');
  })
  it("Login with Valid Email and Wrong password ", function () {
    loginPage.ValidEmailAndNonEmptyPassword('dirk.nonn@cgm.com#1111', '„abcdefg"');
  })
  it("Login is Invalid Credential", function () {
    loginPage.InvalidCredentials('dirk.nonn@cgm.com#1111', '„abcdefg"');
  })
  it("Logi with Valid Credential", function () {
    loginPage.ValidCredentials('dirk.nonn@cgm.com#1111', 'recruitingTest1!');
  })
  it("Verify logout ", function () {
    loginPage.LogOut();
  })

});