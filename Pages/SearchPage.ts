import { browser, element, by, protractor } from "protractor"
export class SearchPage {

    SearchPageLink = element(by.linkText('Suchseite'));
    SearchQueryTypeahead = element(by.id('search-query-typeahead'));
    SearchLocationTypeahead = element(by.id('search-location-typeahead'));
    OnlineBooking = element(by.id('onlineBooking'));
    VideoCall = element(by.id('videoCall'));
    Accessibility = element(by.id('accessibility'));
    SerachButton = element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[6]/div/button'));
    BestHit = element(by.id('bestHit'));
    SortAlphabetically = element(by.id('sortAlphabetically'));
    NoLocation = element(by.id('noLocation'));
    DistanceRangeSlider = element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[2]/app-sort/div/div/div[5]/div/div/ng5-slider'));
    EmptySearchSpan = element(by.xpath('//*[@id="search"]/div/div[3]/div/div/app-empty-state/div/div[2]/div/span'));
    SearchTypeaheadContainer = element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[1]/div/div/typeahead-container'))
    SearchTypeaheadContainerList = element.all(by.className('dropdown-item ng-star-inserted'));
    SearchDefaultPanel = element.all(by.className('card physician-card'));
    OpenSearchPage() {
        browser.driver.manage().window().maximize();
        this.SearchPageLink.click();
        browser.manage().timeouts().implicitlyWait(10000);
    }

    VerifySpecialisation() {
        this.SearchQueryTypeahead.getAttribute('placeholder').then
            (function (element) {
                expect(element).toEqual('Fachbereich oder Name des Arztes');
            })
    }

    VerifyLocationInputField() {
        this.SearchLocationTypeahead.getAttribute('placeholder').then
            (function (element) {
                expect(element).toEqual('Ort, PLZ oder Stadtteil');
            })
    }

    VerifyOnlineBookableCheckBox() {
        expect(this.OnlineBooking.isPresent()).toBeTruthy();
    }

    VerifyVideoConferenceCheckBox() {
        expect(this.VideoCall.isPresent()).toBeTruthy();
    }

    VerifyBarrierFreeCheckBox() {
        expect(this.Accessibility.isPresent()).toBeTruthy();
    }
    VerifySearchButtonExist() {
        browser.waitForAngular();
        expect(this.SerachButton.isPresent()).toBeTruthy();
    }

    VerifyBestResultsRadioBox() {
        expect(this.BestHit.isPresent()).toBeTruthy();
    }

    VerifyAlphabeticalNamesRadioBox() {
        expect(this.SortAlphabetically.isPresent()).toBeTruthy();
    }

    VerifyDistanceRadioBox() {
        expect(this.NoLocation.isPresent()).toBeTruthy();
    }

    VerifyDistanceRangeSlider() {
        expect(this.DistanceRangeSlider.isPresent()).toBeTruthy();
    }

    VerifyEmptySearchMessageExist() {
        this.EmptySearchSpan.getText().then
            (function (element) {
                expect(element).toEqual('AUF DER LINKEN SEITE KANNST DU DIE ARZTSUCHE STARTEN.');
            })
    }

    SetSearchQueryTypeahead(var_args: string): void {
        this.SearchQueryTypeahead.clear();
        this.SearchQueryTypeahead.sendKeys(var_args);
    }
    SetSearchLocationTypeahead(var_args: string): void {
        this.SearchLocationTypeahead.clear();
        this.SearchLocationTypeahead.sendKeys(var_args);
    };

    VerifySearchQueryShowFittingList(var_args: string): void {
        this.SetSearchQueryTypeahead(var_args);
        browser.waitForAngular();
        expect(this.SearchTypeaheadContainer.isPresent()).toBeTruthy();
        expect(this.SearchTypeaheadContainerList.count()).toBeGreaterThanOrEqual(1);
    }

    VerfiySearchRefinementShowFittingList(var_args: string): void {
        this.SetSearchQueryTypeahead(var_args);
        browser.waitForAngular();
        expect(this.SearchTypeaheadContainer.isPresent()).toBeTruthy();
        expect(this.SearchTypeaheadContainerList.count()).toBeGreaterThanOrEqual(1);
    }

    SearchWithNoSearchResult(var_args: string): void {
        this.SetSearchQueryTypeahead(var_args);
        browser.waitForAngular();
        expect(this.SearchTypeaheadContainer.isPresent()).toBeFalsy();

    }
    CheckSearchResult(var_args: string): void {
        this.SetSearchQueryTypeahead(var_args);
        this.SerachButton.click();
        browser.waitForAngular();
        browser.sleep(5000);
        expect(this.SearchDefaultPanel.count()).toBeGreaterThanOrEqual(1);
        let first = this.SearchDefaultPanel.first();
        expect(first.isPresent()).toBeTruthy();
        let header = first.element(by.className("card-header d-flex"));
        expect(header.isPresent()).toBeTruthy();
        expect(header.element(by.className("physician-picture")).isPresent()).toBeTruthy();
        expect(header.element(by.className("physician-name align-self-center")).isPresent()).toBeTruthy();
        expect(header.element(by.className("btn d-sm-none d-md-block see-profile-button")).isPresent()).toBeTruthy();
        let description = first.element(by.className("physician-description"));
        expect(description.isPresent()).toBeTruthy();
        expect(description.element(by.className("description-text")).isPresent()).toBeTruthy();
        expect(description.element(by.className("d-flex flex-row ng-star-inserted")).isPresent()).toBeTruthy();
        expect(description.element(by.className("description-text")).isPresent()).toBeTruthy();
        let physicianCalendar = first.element(by.className("physician-calendar"));
        expect(description.isPresent()).toBeTruthy();
    }
    ScrollToBottom() {
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight|| document.documentElement.scrollHeight)')
    }
    
    ClickShowMoreButton() {
        
        expect(element(by.xpath('//*[@id="search"]/div/div[3]/div/div/div/a')).isPresent()).toBeTruthy();
        element(by.xpath('//*[@id="search"]/div/div[3]/div/div/div/a')).click();
        browser.waitForAngular();
        browser.sleep(5000);
      }

      ScrollTopEntervalidLocationInput (var_args: string): void {
        browser.executeScript('window.scrollTo(0,0);');
        this.SetSearchLocationTypeahead(var_args);
        let searchElement =  element(by.className('locationSearch typeahead-wrapper'));
        browser.waitForAngular();
        expect(searchElement.all(by.className('dropdown-item ng-star-inserted')).count())
        .toBeGreaterThanOrEqual(1);
        searchElement.all(by.className('dropdown-item ng-star-inserted')).get(1).click();
        this.SerachButton.click();
        browser.waitForAngular();
      }

      SelectOnlineBooking(){
        element(by.className("custom-control custom-checkbox")).click();
        browser.waitForAngular();
        expect(this.OnlineBooking).toBeTruthy();
          expect(element(by.className('row onlineBooking no-gutters ng-star-inserted')).isPresent()).toBeTruthy();
       
    }

      SelectOnlineBookingSearch(){
        this.SerachButton.click();
        browser.waitForAngular();
        expect(this.SearchDefaultPanel.count()).toBeGreaterThan(1);
        browser.sleep(5000);
       
    }
    SearchVideoConfAvailability(){
        element(by.className("custom-control custom-checkbox d-flex video-label text-alignment-center")).click();
        this.SearchQueryTypeahead.clear();
        this.SerachButton.click();
        browser.waitForAngular();
        expect(this.SearchDefaultPanel.count()).toBeGreaterThanOrEqual(1);
        let first = this.SearchDefaultPanel.first();
        expect(first.isPresent()).toBeTruthy();
        let header = first.element(by.className("card-header d-flex"));
        expect(header.isPresent()).toBeTruthy();
        expect(header.element(by.className("physician-picture")).isPresent()).toBeTruthy();
        expect(header.element(by.className("physician-name align-self-center")).isPresent()).toBeTruthy();
        expect(header.element(by.className("btn d-sm-none d-md-block see-profile-button")).isPresent()).toBeTruthy();
        let description = first.element(by.className("physician-description"));
        expect(description.isPresent()).toBeTruthy();
        expect(description.element(by.className("description-text")).isPresent()).toBeTruthy();
        expect(description.element(by.className("d-flex flex-row ng-star-inserted")).isPresent()).toBeTruthy();
        expect(description.element(by.className("description-text")).isPresent()).toBeTruthy();
        let physicianCalendar = first.element(by.className("physician-calendar"));
        expect(description.isPresent()).toBeTruthy();
    
}
SearchBarrierFreeAvailability(){
    element(by.className("custom-control custom-checkbox")).click();
    element(by.className("custom-control custom-checkbox d-flex video-label text-alignment-center")).click();
    element(by.className("row mb-4 ng-star-inserted")).click();
        this.SetSearchQueryTypeahead('Beate');
        this.SerachButton.click();
        browser.waitForAngular();
        expect(this.SearchDefaultPanel.count()).toBeGreaterThanOrEqual(1);
        let first = this.SearchDefaultPanel.first();
        expect(first.isPresent()).toBeTruthy();
        let header = first.element(by.className("card-header d-flex"));
        expect(header.isPresent()).toBeTruthy();
        expect(header.element(by.className("physician-picture")).isPresent()).toBeTruthy();
        expect(header.element(by.className("physician-name align-self-center")).isPresent()).toBeTruthy();
        expect(header.element(by.className("btn d-sm-none d-md-block see-profile-button")).isPresent()).toBeTruthy();
        let description = first.element(by.className("physician-description"));
        expect(description.isPresent()).toBeTruthy();
        expect(description.element(by.className("description-text")).isPresent()).toBeTruthy();
        expect(description.element(by.className("d-flex flex-row ng-star-inserted")).isPresent()).toBeTruthy();
        expect(description.element(by.className("description-text")).isPresent()).toBeTruthy();
        let physicianCalendar = first.element(by.className("physician-calendar"));
        expect(description.isPresent()).toBeTruthy();
        element(by.className("row mb-4 ng-star-inserted")).click();
        
}
SortingWithAlphaSortAtoZ(){
element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[2]/app-sort/div/div/div[3]/div/div')).click();
browser.waitForAngular();
browser.sleep(15000);  

}
SortingWithAlphaSortZtoA(){
    
    browser.executeScript(`document.querySelector("#descending").click()`);
    
    browser.waitForAngular();
    browser.sleep(15000);   
}
DragRangeSlider(searchText: string, location: string): void {
  
    this.SetSearchQueryTypeahead(searchText);
    this.SetSearchLocationTypeahead(location);
    this.SerachButton.click();
    browser.waitForAngular();
    browser.sleep(15000);
    var slider = element(
        by.className('custom-slider'));
        browser.actions().
        mouseDown(slider).
        mouseMove(slider).
        mouseMove({x: 0, y: 0}).
        perform();
        browser.sleep(5000);
        browser.actions().
        mouseMove(slider).
        mouseMove({x: 25, y: 0}).
        perform();
        browser.sleep(5000);
        browser.actions().
        mouseMove(slider).
        mouseMove({x: 100, y: 0}).
        mouseUp(slider).
        perform();
    browser.waitForAngular();
    browser.sleep(10000);
}

}

