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
  /* Verify Home page is loaded successfully */
  it('Verify Page Title',function(){ 
    openBasePage.VerifyPageOpen();
  })
  
  it("Open Login Page",  function(){  /* Verify Login Screen is loaded successfully */
    loginPage.OpenLoginWindow();
  })
  it('Verify Login Page Element',function(){ /* Verification of Login Page Elements */
    loginPage.VerifyElementPresentOnLoginPage()
  })
  it("Login with Empty Credentials", function () { /* Click on Login button without any credentials */
    loginPage.LoginReject();
  })
  it("Login with valid Email only", function () {
    loginPage.ValidEmail('junaidkhan.z@hotmail.com'); /* Login attempt using only with Email */
  })
  it("Login with Valid Email and Incorrect password ", function () {
    loginPage.ValidEmailAndNonEmptyPassword('junaidkhan.z@hotmail.com', '„abcdefg"'); /* Login attempt with valid email and invalid password */
  })
  it("Login is Invalid Credential", function () {
    loginPage.InvalidCredentials('dirk.nonn@cgm.com#1111', '„abcdedsffg"'); /* Invalid Login attempt */
  })
  it("Login with Valid Credential", function () {
    loginPage.ValidCredentials('junaidkhan.z@hotmail.com', 'Test123@'); /* Login with Valid Credentials */
  }) 
  // it("Verify logout ", function () { /* Logout Using profile Link */
  //   loginPage.LogOut();
  // })

});