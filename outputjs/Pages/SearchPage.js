"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPage = void 0;
var protractor_1 = require("protractor");
var SearchPage = /** @class */ (function () {
    function SearchPage() {
        this.SearchPageLink = (0, protractor_1.element)(protractor_1.by.linkText('Suchseite'));
        this.SearchQueryTypeahead = (0, protractor_1.element)(protractor_1.by.id('search-query-typeahead'));
        this.SearchLocationTypeahead = (0, protractor_1.element)(protractor_1.by.id('search-location-typeahead'));
        this.OnlineBooking = (0, protractor_1.element)(protractor_1.by.id('onlineBooking'));
        this.VideoCall = (0, protractor_1.element)(protractor_1.by.id('videoCall'));
        this.Accessibility = (0, protractor_1.element)(protractor_1.by.id('accessibility'));
        this.SerachButton = (0, protractor_1.element)(protractor_1.by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[6]/div/button'));
        this.BestHit = (0, protractor_1.element)(protractor_1.by.id('bestHit'));
        this.SortAlphabetically = (0, protractor_1.element)(protractor_1.by.id('sortAlphabetically'));
        this.NoLocation = (0, protractor_1.element)(protractor_1.by.id('noLocation'));
        this.DistanceRangeSlider = (0, protractor_1.element)(protractor_1.by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[2]/app-sort/div/div/div[5]/div/div/ng5-slider'));
        this.EmptySearchSpan = (0, protractor_1.element)(protractor_1.by.xpath('//*[@id="search"]/div/div[3]/div/div/app-empty-state/div/div[2]/div/span'));
        this.SearchTypeaheadContainer = (0, protractor_1.element)(protractor_1.by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[1]/div/div/typeahead-container'));
        this.SearchTypeaheadContainerList = protractor_1.element.all(protractor_1.by.className('dropdown-item ng-star-inserted'));
        this.SearchDefaultPanel = protractor_1.element.all(protractor_1.by.className('card physician-card'));
    }
    SearchPage.prototype.OpenSearchPage = function () {
        protractor_1.browser.driver.manage().window().maximize();
        this.SearchPageLink.click();
        protractor_1.browser.manage().timeouts().implicitlyWait(10000);
    };
    SearchPage.prototype.VerifySpecialisation = function () {
        this.SearchQueryTypeahead.getAttribute('placeholder').then(function (element) {
            expect(element).toEqual('Fachbereich oder Name des Arztes');
        });
    };
    SearchPage.prototype.VerifyLocationInputField = function () {
        this.SearchLocationTypeahead.getAttribute('placeholder').then(function (element) {
            expect(element).toEqual('Ort, PLZ oder Stadtteil');
        });
    };
    SearchPage.prototype.VerifyOnlineBookableCheckBox = function () {
        expect(this.OnlineBooking.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifyVideoConferenceCheckBox = function () {
        expect(this.VideoCall.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifyBarrierFreeCheckBox = function () {
        expect(this.Accessibility.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifySearchButtonExist = function () {
        protractor_1.browser.waitForAngular();
        expect(this.SerachButton.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifyBestResultsRadioBox = function () {
        expect(this.BestHit.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifyAlphabeticalNamesRadioBox = function () {
        expect(this.SortAlphabetically.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifyDistanceRadioBox = function () {
        expect(this.NoLocation.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifyDistanceRangeSlider = function () {
        expect(this.DistanceRangeSlider.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.VerifyEmptySearchMessageExist = function () {
        this.EmptySearchSpan.getText().then(function (element) {
            expect(element).toEqual('AUF DER LINKEN SEITE KANNST DU DIE ARZTSUCHE STARTEN.');
        });
    };
    SearchPage.prototype.SetSearchQueryTypeahead = function (var_args) {
        this.SearchQueryTypeahead.clear();
        this.SearchQueryTypeahead.sendKeys(var_args);
    };
    SearchPage.prototype.SetSearchLocationTypeahead = function (var_args) {
        this.SearchLocationTypeahead.clear();
        this.SearchLocationTypeahead.sendKeys(var_args);
    };
    ;
    SearchPage.prototype.VerifySearchQueryShowFittingList = function (var_args) {
        this.SetSearchQueryTypeahead(var_args);
        protractor_1.browser.waitForAngular();
        expect(this.SearchTypeaheadContainer.isPresent()).toBeTruthy();
        expect(this.SearchTypeaheadContainerList.count()).toBeGreaterThanOrEqual(1);
    };
    SearchPage.prototype.VerfiySearchRefinementShowFittingList = function (var_args) {
        this.SetSearchQueryTypeahead(var_args);
        protractor_1.browser.waitForAngular();
        expect(this.SearchTypeaheadContainer.isPresent()).toBeTruthy();
        expect(this.SearchTypeaheadContainerList.count()).toBeGreaterThanOrEqual(1);
    };
    SearchPage.prototype.SearchWithNoSearchResult = function (var_args) {
        this.SetSearchQueryTypeahead(var_args);
        protractor_1.browser.waitForAngular();
        expect(this.SearchTypeaheadContainer.isPresent()).toBeFalsy();
    };
    SearchPage.prototype.CheckSearchResult = function (var_args) {
        this.SetSearchQueryTypeahead(var_args);
        this.SerachButton.click();
        protractor_1.browser.waitForAngular();
        protractor_1.browser.sleep(5000);
        expect(this.SearchDefaultPanel.count()).toBeGreaterThanOrEqual(1);
        var first = this.SearchDefaultPanel.first();
        expect(first.isPresent()).toBeTruthy();
        var header = first.element(protractor_1.by.className("card-header d-flex"));
        expect(header.isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("physician-picture")).isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("physician-name align-self-center")).isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("btn d-sm-none d-md-block see-profile-button")).isPresent()).toBeTruthy();
        var description = first.element(protractor_1.by.className("physician-description"));
        expect(description.isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("description-text")).isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("d-flex flex-row ng-star-inserted")).isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("description-text")).isPresent()).toBeTruthy();
        var physicianCalendar = first.element(protractor_1.by.className("physician-calendar"));
        expect(description.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.ScrollToBottom = function () {
        protractor_1.browser.executeScript('window.scrollTo(0, document.body.scrollHeight|| document.documentElement.scrollHeight)');
    };
    SearchPage.prototype.ClickShowMoreButton = function () {
        expect((0, protractor_1.element)(protractor_1.by.xpath('//*[@id="search"]/div/div[3]/div/div/div/a')).isPresent()).toBeTruthy();
        (0, protractor_1.element)(protractor_1.by.xpath('//*[@id="search"]/div/div[3]/div/div/div/a')).click();
        protractor_1.browser.waitForAngular();
        protractor_1.browser.sleep(5000);
    };
    SearchPage.prototype.ScrollTopEntervalidLocationInput = function (var_args) {
        protractor_1.browser.executeScript('window.scrollTo(0,0);');
        this.SetSearchLocationTypeahead(var_args);
        var searchElement = (0, protractor_1.element)(protractor_1.by.className('locationSearch typeahead-wrapper'));
        protractor_1.browser.waitForAngular();
        expect(searchElement.all(protractor_1.by.className('dropdown-item ng-star-inserted')).count())
            .toBeGreaterThanOrEqual(1);
        searchElement.all(protractor_1.by.className('dropdown-item ng-star-inserted')).get(1).click();
        this.SerachButton.click();
        protractor_1.browser.waitForAngular();
    };
    SearchPage.prototype.SelectOnlineBooking = function () {
        (0, protractor_1.element)(protractor_1.by.className("custom-control custom-checkbox")).click();
        protractor_1.browser.waitForAngular();
        expect(this.OnlineBooking).toBeTruthy();
        expect((0, protractor_1.element)(protractor_1.by.className('row onlineBooking no-gutters ng-star-inserted')).isPresent()).toBeTruthy();
    };
    SearchPage.prototype.SelectOnlineBookingSearch = function () {
        this.SerachButton.click();
        protractor_1.browser.waitForAngular();
        expect(this.SearchDefaultPanel.count()).toBeGreaterThan(1);
        protractor_1.browser.sleep(5000);
    };
    SearchPage.prototype.SearchVideoConfAvailability = function () {
        (0, protractor_1.element)(protractor_1.by.className("custom-control custom-checkbox d-flex video-label text-alignment-center")).click();
        this.SearchQueryTypeahead.clear();
        this.SerachButton.click();
        protractor_1.browser.waitForAngular();
        expect(this.SearchDefaultPanel.count()).toBeGreaterThanOrEqual(1);
        var first = this.SearchDefaultPanel.first();
        expect(first.isPresent()).toBeTruthy();
        var header = first.element(protractor_1.by.className("card-header d-flex"));
        expect(header.isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("physician-picture")).isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("physician-name align-self-center")).isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("btn d-sm-none d-md-block see-profile-button")).isPresent()).toBeTruthy();
        var description = first.element(protractor_1.by.className("physician-description"));
        expect(description.isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("description-text")).isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("d-flex flex-row ng-star-inserted")).isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("description-text")).isPresent()).toBeTruthy();
        var physicianCalendar = first.element(protractor_1.by.className("physician-calendar"));
        expect(description.isPresent()).toBeTruthy();
    };
    SearchPage.prototype.SearchBarrierFreeAvailability = function () {
        (0, protractor_1.element)(protractor_1.by.className("custom-control custom-checkbox")).click();
        (0, protractor_1.element)(protractor_1.by.className("custom-control custom-checkbox d-flex video-label text-alignment-center")).click();
        (0, protractor_1.element)(protractor_1.by.className("row mb-4 ng-star-inserted")).click();
        this.SetSearchQueryTypeahead('Beate');
        this.SerachButton.click();
        protractor_1.browser.waitForAngular();
        expect(this.SearchDefaultPanel.count()).toBeGreaterThanOrEqual(1);
        var first = this.SearchDefaultPanel.first();
        expect(first.isPresent()).toBeTruthy();
        var header = first.element(protractor_1.by.className("card-header d-flex"));
        expect(header.isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("physician-picture")).isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("physician-name align-self-center")).isPresent()).toBeTruthy();
        expect(header.element(protractor_1.by.className("btn d-sm-none d-md-block see-profile-button")).isPresent()).toBeTruthy();
        var description = first.element(protractor_1.by.className("physician-description"));
        expect(description.isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("description-text")).isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("d-flex flex-row ng-star-inserted")).isPresent()).toBeTruthy();
        expect(description.element(protractor_1.by.className("description-text")).isPresent()).toBeTruthy();
        var physicianCalendar = first.element(protractor_1.by.className("physician-calendar"));
        expect(description.isPresent()).toBeTruthy();
        (0, protractor_1.element)(protractor_1.by.className("row mb-4 ng-star-inserted")).click();
    };
    SearchPage.prototype.SortingWithAlphaSortAtoZ = function () {
        (0, protractor_1.element)(protractor_1.by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[2]/app-sort/div/div/div[3]/div/div')).click();
        protractor_1.browser.waitForAngular();
        protractor_1.browser.sleep(15000);
    };
    SearchPage.prototype.SortingWithAlphaSortZtoA = function () {
        protractor_1.browser.executeScript("document.querySelector(\"#descending\").click()");
        protractor_1.browser.waitForAngular();
        protractor_1.browser.sleep(15000);
    };
    SearchPage.prototype.DragRangeSlider = function (searchText, location) {
        this.SetSearchQueryTypeahead(searchText);
        this.SetSearchLocationTypeahead(location);
        this.SerachButton.click();
        protractor_1.browser.waitForAngular();
        protractor_1.browser.sleep(15000);
        var slider = (0, protractor_1.element)(protractor_1.by.className('custom-slider'));
        protractor_1.browser.actions().
            mouseDown(slider).
            mouseMove(slider).
            mouseMove({ x: 0, y: 0 }).
            perform();
        protractor_1.browser.sleep(5000);
        protractor_1.browser.actions().
            mouseMove(slider).
            mouseMove({ x: 25, y: 0 }).
            perform();
        protractor_1.browser.sleep(5000);
        protractor_1.browser.actions().
            mouseMove(slider).
            mouseMove({ x: 100, y: 0 }).
            mouseUp(slider).
            perform();
        protractor_1.browser.waitForAngular();
        protractor_1.browser.sleep(10000);
    };
    return SearchPage;
}());
exports.SearchPage = SearchPage;
