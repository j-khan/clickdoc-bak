import { browser, element, by, protractor } from "protractor"
export class HomePage{
   
    VerifyPageOpen (){
        browser.waitForAngularEnabled(false);
        browser.get("https://demo.clickdoc.de");
        browser.waitForAngular();
        expect(browser.getTitle()).toContain("CLICKDOC");
        browser.sleep(3000);
        element(by.xpath('/html/body/app-root/div[2]/app-consent-gdpr-container/app-modal-wrapper/div/div[2]/div[3]/button[1]')).click();
    }
     
    
}