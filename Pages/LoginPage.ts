import { browser, element, by, protractor } from "protractor"
export class LoginPage {
    Email = element(by.id('mat-input-1'));
    EmailError = element(by.id('mat-error-0'));
    Password = element(by.id('mat-input-2'));
    CloseIcon = element(by.xpath('/html/body/app-iframe-dialog/div/div/div/span'));
    RegistrationButton = element(by.className('life-secondary-btn ng-star-inserted'));
    ForgotPasswordButton = element(by.className('bold small'));
    LoginButton = element(by.css('body > app-root > div > div > main > app-login > form > div.content > div > div > div.d-none.d-sm-block.buttons > button.life-primary-btn'));
    InvalidCredentialsMessage = element(by.xpath('/html/body/app-root/div/div/main/app-login/form/div[1]/div/div/app-error-message/div/div[1]/p'));
    ProfileLink = element(by.linkText('Profil'));
    AccountProfileLink = element(by.xpath('/html/body/app-root/div[2]/div/app-header/div/div/div/div[2]/ul/li[5]/a/div/span'));
    LogOutLink = element(by.xpath('/html/body/app-root/div[2]/div/app-header/div/div/div/div[2]/ul/li[5]/div/div/a[2]/div/span[2]/font/font'));
    
    VerifyElementPresentOnLoginPage(){
        //browser.sleep(5000);
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
        browser.sleep(3000);
    }

    CheckInValidEmail() {
        expect(this.EmailError.getText()).toContain('Bitte geben Sie Ihre E-Mail-Adresse ein.');
    }

    CheckInvalidPassword() {
        expect(this.Password.getAttribute("ng-invalid"));
    }

    LoginReject() {
        browser.switchTo().frame(browser.findElement(protractor.By.id('iframeDialog')));
        //browser.sleep(5000);
        this.LoginCmd();
        browser.sleep(3000);
        this.CheckInValidEmail();
        this.CheckInvalidPassword();
    }

    ValidEmail(var_args: string): void {
        this.SetEmail(var_args);
        expect(element(by.id('mat-input-1')).getAttribute("ng-valid"));
        expect(element(by.id('mat-input-2')).getAttribute("ng-invalid"));
    };

    ValidEmailAndNonEmptyPassword(email: string, password: string): void {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginCmd();
        browser.sleep(2000);
        expect(this.InvalidCredentialsMessage.getText()).toContain('Bitte überprüfen Sie Ihre Eingaben und probieren Sie es erneut. Haben Sie noch keine CGM LIFE ID?');
        //expect(element(by.id('mat-input-1')).getAttribute("ng-valid"));
        //expect(element(by.id('mat-input-2')).getAttribute("ng-invalid"));
    };

    InvalidCredentials(email: string, password: string): void {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        browser.sleep(5000);
        expect(this.InvalidCredentialsMessage.isPresent());

    };

    ValidCredentials(email: string, password: string): void {
        this.SetEmail(email);
        this.SetPassword(password);
        this.LoginButton.click();
        browser.sleep(8000);
        this.AccountProfileLink.click();
        expect(this.LogOutLink.isPresent());


    };

    LogOut() {
        browser.sleep(10000);
        this.AccountProfileLink.click();
        browser.sleep(10000);
        this.LogOutLink.click();
        browser.sleep(10000);
    }

}

