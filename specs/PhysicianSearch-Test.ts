import { browser, element, by, protractor } from "protractor"
import { HomePage } from "../Pages/HomePage"
import {SearchPage} from "../Pages/SearchPage"

let openBasePage = new HomePage();
let searchPage = new SearchPage();

describe('Searching Mechanism', function(){
    beforeEach(function(){
              browser.waitForAngularEnabled(false);
              jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
          })
    it('Open Home Page',function(){ /* Open Home page so User can move to Search Section */
        openBasePage.VerifyPageOpen();
    })
    it('Moved to Search Section',function(){  /* User Clicked on serach section and now Search page is Open */
        searchPage.OpenSearchPage()
      })
   })
   describe('Verify Search Section',function(){
  
     it('Verify Specialisation/Name Inputfield',function(){ /* Verify Specialisation name Field is present on page */
      searchPage.VerifySpecialisation()
          })
    
  it('Verify Location Input Field', function () { /* Verify location Field is present on page */ 
    searchPage.VerifyLocationInputField();
  })

  it('Verify Online Bookable CheckBox', function () { /* Verify Online Bookable filter is present on page */
    searchPage.VerifyOnlineBookableCheckBox();
  })
  it('Verify Video Conference CheckBox', function () { /* Verify Video Conference filter is present on page */
    searchPage.VerifyVideoConferenceCheckBox();
  })
  it('Verify Barrier-Free CheckBox', function () { /* Verify Barrier Free filter is present on page */
    searchPage.VerifyBarrierFreeCheckBox();
  })
  it('Verify Search Button', function () {  /* Verify Search Button is present on page */
    searchPage.VerifySearchButtonExist();
  })
})

describe('Verify Sorting Section', function () { /* This section will verify Sorting results */
  it('Verify Best Results Radio Box', function () { /*Verify Radion button of Best Results */
    searchPage.VerifyBestResultsRadioBox();   
  })
  it('Verify Alphabetical Names Radio Box', function () { /*Verify Aplhabatical sorting radio button */
    searchPage.VerifyAlphabeticalNamesRadioBox();
  })
  it('Verify Distance Radio Box', function () { /*Verify Distance sorting radio button */
    searchPage.VerifyDistanceRadioBox();
  })
  it('Verify Distance-Range slider', function () { /*Verify Distance sorting slide Bar */
    searchPage.VerifyDistanceRangeSlider();
  })
})

describe('Verify Result Section', function () {
  it('Verify Result Section with Notification for Physician Search', function () {
    searchPage.VerifyEmptySearchMessageExist();
  })
})

describe("Physician Search", function () {
  it('Select the "Name" Inputfield in the search section and enter any input', function () {
    searchPage.VerifySearchQueryShowFittingList("Beate");
  })
  it('Search refinement step-2', function () {
    searchPage.VerfiySearchRefinementShowFittingList('Beate Edel');
  })

  it('Search with No Search result', function () {
    searchPage.SearchWithNoSearchResult('Beate Edelse');
  })
})

describe("search-result", function () {

  it('Check a search-result object', function () {
    searchPage.CheckSearchResult("Beate");
  })
  
  it('Scroll to the bottom of the page', function () {
    searchPage.ScrollToBottom();
   })

  it('Click on  Show more Button', function () {
    searchPage.ClickShowMoreButton();
  })

  it('Scroll back to the top and enter valid data into the Location Input field', function () {
    searchPage.ScrollTopEntervalidLocationInput("56567");
  })

  it('Check the "Online Bookable“ Checkbox', function () {
    searchPage.SelectOnlineBooking();
  })

  it('Searching Online Bookable Doc ', function () {
    searchPage.SelectOnlineBookingSearch();
  })
it('Searching with Video Conference availability of Doc',function(){
searchPage.SearchVideoConfAvailability();
})

it('Searching with Barrier Free selection',function(){
  searchPage.SearchBarrierFreeAvailability();
  })

  it('Search Sorting with Aplhabatically A-Z',function(){
    searchPage.SortingWithAlphaSortAtoZ();
    })
    it('Search Sorting with Aplhabatically Z-A',function(){
      searchPage.SortingWithAlphaSortZtoA();
     })
      it('Distance range slider',function(){
        searchPage.DragRangeSlider("Beate","56567");
        })
});
  