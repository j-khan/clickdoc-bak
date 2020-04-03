import { browser, element, by, protractor } from "protractor"
export class LoginPage {
    Email = element(by.xpath('//*[@id="mat-input-0"]'));
    Password = element(by.xpath('//*[@id="mat-input-1"]'));
    CloseIcon = element(by.xpath('/html/body/app-iframe-dialog/div/div/div/span'));
    RegistrationButton = element(by.className('life-btn life-secondary-btn'));
    ForgotPasswordButton = element(by.className('link margin-top-15'));
    LoginButton = element(by.xpath('/html/body/app-root/div/div/main/app-login/div/div[1]/div/div/div[2]/div[2]/div[2]/button'));
    InvalidCredentialsMessage = element(by.xpath('/html/body/app-root/div/div/main/app-login/div/div[1]/div/div/div[2]/div[1]/div[1]/div/app-error-message/div'));
    ProfileLink = element(by.linkText('Profil'));
    AccountProfileLink = element(by.xpath('/html/body/app-root/div[2]/app-header/div/div[2]/div/div[2]/ul/li[7]/a/app-avatar/div'));
    LogOutLink = element(by.xpath('/html/body/app-root/div[2]/app-header/div/div[2]/div/div[2]/ul/li[7]/div/div/a[2]/div/span[2]'));
    
    VerifyElementPresentOnLoginPage(){
        expect(this.CloseIcon.isPresent())
        expect(this.Email.isPresent())
        expect(this.Password.isPresent())
        expect(this.ForgotPasswordButton.isPresent())
        expect(this.RegistrationButton.isPresent())
        expect(this.LoginButton.isPresent())
     }

    SetEmail(var_args: string): void {
        this.Email.clear();
        this.Email.sendKeys(var_args);
    };

    SetPassword(var_args: string): void {
        this.Password.clear();
        this.Password.sendKeys(var_args);
    };

    LoginCmd() {
        this.LoginButton.click();
    }

    OpenLoginWindow() {
        browser.driver.manage().window().maximize();
        this.ProfileLink.click();
        browser.sleep(15000);
    }

    CheckInValidEmail() {
        expect(this.Email.getAttribute("ng-invalid"));
    }

    CheckInvalidPassword() {
        expect(this.Password.getAttribute("ng-invalid"));
    }

    LoginReject() {
        browser.switchTo().frame(browser.findElement(protractor.By.id('iframeDialog')));
        browser.sleep(15000);
        this.LoginCmd();
        this.CheckInValidEmail();
        this.CheckInvalidPassword();
    }

    ValidEmail(var_args: string): void {
        this.SetEmail(var_args);
        expect(element(by.xpath('//*[@id="mat-input-0"]')).getAttribute("ng-valid"));
        expect(element(by.xpath('//*[@id="mat-input-1"]')).getAttribute("ng-invalid"));
    };

    ValidEmailAndNonEmptyPassword(email: string, password: string): void {
        this.SetEmail(email);
        this.SetPassword(password);

        expect(element(by.xpath('//*[@id="mat-input-0"]')).getAttribute("ng-valid"));
        expect(element(by.xpath('//*[@id="mat-input-1"]')).getAttribute("ng-invalid"));
    };

    InvalidCredentials(email: string, password: string): void {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        browser.sleep(10000);
        expect(this.InvalidCredentialsMessage.isPresent());

    };

    ValidCredentials(email: string, password: string): void {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        browser.sleep(10000);

    };

    LogOut() {
        browser.sleep(10000);
        this.AccountProfileLink.click();
        browser.sleep(10000);
        this.LogOutLink.click();
        browser.sleep(10000);
    }

}

