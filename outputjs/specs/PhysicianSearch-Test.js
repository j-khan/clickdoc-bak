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
    it('Click on  Show more Button', function () {
        searchPage.ClickShowMoreButton();
    });
    it('Scroll back to the top and enter valid data into the Location Input field', function () {
        searchPage.ScrollTopEntervalidLocationInput("56567");
    });
    it('Check the "Online Bookable“ Checkbox', function () {
        searchPage.SelectOnlineBooking();
    });
    it('Searching Online Bookable Doc ', function () {
        searchPage.SelectOnlineBookingSearch();
    });
    it('Searching with Video Conference availability of Doc', function () {
        searchPage.SearchVideoConfAvailability();
    });
    it('Searching with Barrier Free selection', function () {
        searchPage.SearchBarrierFreeAvailability();
    });
    it('Search Sorting with Aplhabatically A-Z', function () {
        searchPage.SortingWithAlphaSortAtoZ();
    });
    it('Search Sorting with Aplhabatically Z-A', function () {
        searchPage.SortingWithAlphaSortZtoA();
    });
    it('Distance range slider', function () {
        searchPage.DragRangeSlider("Beate", "56567");
    });
});
