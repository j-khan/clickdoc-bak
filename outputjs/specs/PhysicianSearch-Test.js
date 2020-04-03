"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var HomePage_1 = require("../Pages/HomePage");
var SearchPage_1 = require("../Pages/SearchPage");
var openBasePage = new HomePage_1.HomePage();
var searchPage = new SearchPage_1.SearchPage();
describe('Searching Mechanism', function () {
    beforeEach(function () {
        protractor_1.browser.waitForAngularEnabled(false);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });
    it('Open Home Page', function () {
        openBasePage.VerifyPageOpen();
    });
    it('Moved to Search Section', function () {
        searchPage.OpenSearchPage();
    });
});
describe('Verify Search Section', function () {
    it('Verify Specialisation/Name Inputfield', function () {
        searchPage.VerifySpecialisation();
    });
    it('Verify Location Input Field', function () {
        searchPage.VerifyLocationInputField();
    });
    it('Verify Online Bookable CheckBox', function () {
        searchPage.VerifyOnlineBookableCheckBox();
    });
    it('Verify Video Conference CheckBox', function () {
        searchPage.VerifyVideoConferenceCheckBox();
    });
    it('Verify Barrier-Free CheckBox', function () {
        searchPage.VerifyBarrierFreeCheckBox();
    });
    it('Verify Search Button', function () {
        searchPage.VerifySearchButtonExist();
    });
});
describe('Verify Sorting Section', function () {
    it('Verify Best Results Radio Box', function () {
        searchPage.VerifyBestResultsRadioBox();
    });
    it('Verify Alphabetical Names Radio Box', function () {
        searchPage.VerifyAlphabeticalNamesRadioBox();
    });
    it('Verify Distance Radio Box', function () {
        searchPage.VerifyDistanceRadioBox();
    });
    it('Verify Distance-Range slider', function () {
        searchPage.VerifyDistanceRangeSlider();
    });
});
describe('Verify Result Section', function () {
    it('Verify Result Section with Notification for Physician Search', function () {
        searchPage.VerifyEmptySearchMessageExist();
    });
});
describe("Physician Search", function () {
    it('Select the "Name" Inputfield in the search section and enter any input', function () {
        searchPage.VerifySearchQueryShowFittingList("Beate");
    });
    it('Search refinement step-2', function () {
        searchPage.VerfiySearchRefinementShowFittingList('Beate Edel');
    });
    it('Search with No Search result', function () {
        searchPage.SearchWithNoSearchResult('Beate Edelse');
    });
});
describe("search-result", function () {
    it('Check a search-result object', function () {
        searchPage.CheckSearchResult("Beate");
    });
    it('Scroll to the bottom of the page', function () {
        searchPage.ScrollToBottom();
    });
    it('Click the "Show more" -Button', function () {
        searchPage.ClickShowMoreButton();
    });
    it('Scroll back to the top and enter valid data into the "Location"-Inputfield', function () {
        searchPage.ScrollTopEntervalidLocationInput("56567");
    });
    it('Check the "Online Bookable“-Checkbox', function () {
        searchPage.SelectOnlineBooking();
    });
    it('Click the "Search-Button i.e with " again', function () {
        searchPage.SelectOnlineBookingSearch();
    });
    it('Searching with Video Conference availability of Doc', function () {
        searchPage.SearchVideoConfAvailability();
    });
    it('Searching with Barrier Free', function () {
        searchPage.SearchBarrierFreeAvailability();
    });
    it('Search Sorting with Aplhabatically A-Z', function () {
        searchPage.SortingWithAlphaSortAtoZ();
    });
    it('Search Sorting with Aplhabatically Z-A', function () {
        searchPage.SortingWithAlphaSortZtoA();
    });
    it('Drag range slider without releasing it', function () {
        searchPage.DragRangeSlider("Beate", "56567");
    });
});
//       it('Verify Online Bookable CheckBox',function(){
//         expect(element(by.id('onlineBooking')).isPresent()).toBeTruthy();
//          })
//         it('Verify Video Conference CheckBox',function(){
//           expect(element(by.id('videoCall')).isPresent()).toBeTruthy();
//            })
//           it('Verify Barrier-Free CheckBox',function(){
//            expect(element(by.id('accessibility')).isPresent()).toBeTruthy();
//              })
//              it('Verify Search Button',function(){
//                  browser.sleep(5000);
//               expect(element(by.xpath('//*[@id="search"]/div/div[3]/div/div/app-empty-state/div/div[2]')).isPresent()).toBeTruthy();
//                 })
//   })
//   describe('Verify Sorting Section',function(){
//     it('Verify Best Results Radio Box',function(){
//       expect(element(by.id('bestHit')).isPresent()).toBeTruthy();
//     })
//     it('Verify Alphabetical Names Radio Box',function(){
//       expect(element(by.id('sortAlphabetically')).isPresent()).toBeTruthy();
//     })
//     it('Verify Distance Radio Box',function(){
//       expect(element(by.id('noLocation')).isPresent()).toBeTruthy();
//     })
//     it('Verify Distance-Range slider',function(){
//       expect(element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[2]/app-sort/div/div/div[5]/div/div/ng5-slider')).isPresent()).toBeTruthy();
//         })
//     })
//         describe('Verify Result Section',function(){
//       it('Verify Result Section with Notification for Physician Search',function(){
//         element(by.xpath('//*[@id="search"]/div/div[3]/div/div/app-empty-state/div/div[2]/div/span')).getText().then
//         (function(element){expect(element).toEqual('AUF DER LINKEN SEITE KANNST DU DIE ARZTSUCHE STARTEN.');    
//       })
//     })
// })
// describe("Physician Search",function(){
//     it('Select the "Name" Inputfield in the search section and enter any input', function () {
//         element(by.xpath('//*[@id="search-query-typeahead"]')).sendKeys('Beate');
//         browser.sleep(1000);
//         expect(element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[1]/div/div/typeahead-container')).isPresent()).toBeTruthy();
//         debugger;
//         var els = element.all(by.className('dropdown-item ng-star-inserted'));
//         expect(els.count()).toBeGreaterThanOrEqual(3);
//       })
//       it('Search refinement step-2', function () {
//         element(by.xpath('//*[@id="search-query-typeahead"]')).clear();
//         element(by.xpath('//*[@id="search-query-typeahead"]')).sendKeys('Beate Edel');
//         browser.sleep(1000);
//         expect(element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[1]/div/div/typeahead-container')).isPresent()).toBeTruthy();
//         debugger;
//         var els = element.all(by.className('dropdown-item ng-star-inserted'));
//         expect(els.count()).toBeGreaterThanOrEqual(2);
//     })
//     it('Search with No Search result', function () {
//       element(by.xpath('//*[@id="search-query-typeahead"]')).clear();
//       element(by.xpath('//*[@id="search-query-typeahead"]')).sendKeys('Beate Edelse');
//       browser.sleep(1000);
//       expect(element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[1]/div/div/typeahead-container')).isPresent()).toBeFalsy();
//       //debugger;
//       var els = element.all(by.className('dropdown-item ng-star-inserted'));
//       expect(els.count()).toBeGreaterThanOrEqual(0);
//   })
//   it('Select with Valid Input', function () {
//     element(by.xpath('//*[@id="search-query-typeahead"]')).clear();
//     element(by.xpath('//*[@id="search-query-typeahead"]')).sendKeys('Beate');
//     browser.sleep(1000);
//     //expect(element(by.xpath('//*[@id="search"]/div/div[2]/div[2]/div[1]/app-filter/div/div/div[2]/div[1]/div/div/typeahead-container')).isPresent()).toBeTruthy();
//     element(by.className('btn btn-primary btn-block')).click();
//     // debugger;
//     // var els = element.all(by.className('dropdown-item ng-star-inserted'));
//     //expect(els.count()).toBeGreaterThanOrEqual(3);
//     browser.sleep(5000);
//     browser.manage().timeouts().implicitlyWait(10000);
//     expect(element(by.className('card physician-card')).isPresent()).toBeTruthy();
//   })
//   describe('Search Result Object Verification',function(){
//   it('Verify Headline i.e. Physician Picture, Name and Profile Button',function(){
//     expect(element(by.className('card physician-card')).isPresent()).toBeTruthy();
//     //expect(element(by.className('ng-star-inserted')).isPresent()).toBeTruthy();
//       // var elements = element.all(by.className('ng-star-inserted')).then(function(elems) {
//       //   expect(elems.length).toEqual(21);
//       //   expect(this.SearchDefaultPanel.count()).toBeGreaterThanOrEqual(3000);
//       //   let first =this.SearchDefaultPanel.first();
// expect(element(by.xpath('//*[@id="search"]/div/div[3]/div/div/app-physician-card[1]/div/div[1]/div[1]/app-avatar/div/img2')).isPresent()).toBeTruthy();
//         //*[@id="search"]/div/div[3]/div/div/app-physician-card[1]/div/div[1]/div[1]/app-avatar/div/img
//     })
//       //expect<any>(elements.count()).toBe(21);
//   })
// //})
//   });
