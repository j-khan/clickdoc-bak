import { browser, element, by, protractor } from "protractor"
export class HomePage{
   
    VerifyPageOpen (){
        browser.waitForAngularEnabled(false);
        browser.get("https://demo.clickdoc.de");
        browser.waitForAngular();
        expect(browser.getTitle()).toContain("CLICKDOC");
    }
     
    
}