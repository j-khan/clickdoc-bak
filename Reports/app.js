var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "Verify Page Title|UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007500a7-0089-0091-00a6-00bb006c00f8.png",
        "timestamp": 1585941586149,
        "duration": 2372
    },
    {
        "description": "Open Login Page|UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "002c00b4-009b-00ad-0060-00f80023004f.png",
        "timestamp": 1585941589320,
        "duration": 17756
    },
    {
        "description": "Verify Login Page Element|UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00a800f7-0057-000e-00ff-00cd00b40077.png",
        "timestamp": 1585941607715,
        "duration": 84
    },
    {
        "description": "Login with Empty Credentials|UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00550011-0017-000a-0088-00ea00060053.png",
        "timestamp": 1585941608401,
        "duration": 15222
    },
    {
        "description": "Login with valid e-mail|UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "005b003d-009c-0019-00e0-00d500f000ff.png",
        "timestamp": 1585941624359,
        "duration": 422
    },
    {
        "description": "Login with Valid Email and Wrong password |UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "004400f3-000b-003d-00ca-003a00fc004d.png",
        "timestamp": 1585941625381,
        "duration": 448
    },
    {
        "description": "Login is Invalid Credential|UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00180097-004f-0030-00db-00910041002c.png",
        "timestamp": 1585941626459,
        "duration": 10530
    },
    {
        "description": "Logi with Valid Credential|UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://demo.clickdoc.de/cd-de/scripts.5908aaef1db3a113210a.js 0 Invalid asm.js: Unexpected token",
                "timestamp": 1585941648202,
                "type": ""
            }
        ],
        "screenShotFile": "00f400d2-0049-008b-003b-001c007400ef.png",
        "timestamp": 1585941637610,
        "duration": 10589
    },
    {
        "description": "Verify logout |UI Automation testing of ClickDOc Application",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00480058-0038-0094-00d8-002100780067.png",
        "timestamp": 1585941648776,
        "duration": 30210
    },
    {
        "description": "Open Home Page|Searching Mechanism",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c30088-0035-0000-00e0-00fa00ac000f.png",
        "timestamp": 1585941679789,
        "duration": 525
    },
    {
        "description": "Moved to Search Section|Searching Mechanism",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00980087-00fa-005a-003d-003800910082.png",
        "timestamp": 1585941681197,
        "duration": 1231
    },
    {
        "description": "Verify Specialisation/Name Inputfield|Verify Search Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004e0013-005e-0056-006d-00fa00900095.png",
        "timestamp": 1585941683379,
        "duration": 175
    },
    {
        "description": "Verify Location Input Field|Verify Search Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005200ba-00e5-00c3-0077-006000770071.png",
        "timestamp": 1585941684623,
        "duration": 28
    },
    {
        "description": "Verify Online Bookable CheckBox|Verify Search Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0000005e-0015-004d-00bc-00810080009d.png",
        "timestamp": 1585941685213,
        "duration": 27
    },
    {
        "description": "Verify Video Conference CheckBox|Verify Search Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ae005b-009f-008d-00f6-00f5009900d5.png",
        "timestamp": 1585941685777,
        "duration": 24
    },
    {
        "description": "Verify Barrier-Free CheckBox|Verify Search Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bb00ac-000a-0071-007b-001300080073.png",
        "timestamp": 1585941686367,
        "duration": 26
    },
    {
        "description": "Verify Search Button|Verify Search Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009d0047-0062-0054-0003-00d900e8007d.png",
        "timestamp": 1585941687001,
        "duration": 23
    },
    {
        "description": "Verify Best Results Radio Box|Verify Sorting Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004d0089-0065-00da-0016-0059004d0017.png",
        "timestamp": 1585941687558,
        "duration": 26
    },
    {
        "description": "Verify Alphabetical Names Radio Box|Verify Sorting Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0068000c-00e9-0019-001e-007600e200c6.png",
        "timestamp": 1585941688103,
        "duration": 19
    },
    {
        "description": "Verify Distance Radio Box|Verify Sorting Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006d0074-002e-0037-0071-00f200890090.png",
        "timestamp": 1585941688659,
        "duration": 23
    },
    {
        "description": "Verify Distance-Range slider|Verify Sorting Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00010003-007a-004c-0054-00f900ba0096.png",
        "timestamp": 1585941689229,
        "duration": 23
    },
    {
        "description": "Verify Result Section with Notification for Physician Search|Verify Result Section",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ad00bb-00d5-00c7-0010-00ed00f70028.png",
        "timestamp": 1585941689784,
        "duration": 47
    },
    {
        "description": "Select the \"Name\" Inputfield in the search section and enter any input|Physician Search",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00600015-004c-00de-00ed-006b00160097.png",
        "timestamp": 1585941690371,
        "duration": 637
    },
    {
        "description": "Search refinement step-2|Physician Search",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001e00c7-00f3-0097-0009-00c1005e008b.png",
        "timestamp": 1585941691583,
        "duration": 672
    },
    {
        "description": "Search with No Search result|Physician Search",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008e006b-009d-004b-008c-00f800fc002c.png",
        "timestamp": 1585941692813,
        "duration": 10256
    },
    {
        "description": "Check a search-result object|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00870015-007c-002c-00fc-00cb00660022.png",
        "timestamp": 1585941703599,
        "duration": 5589
    },
    {
        "description": "Scroll to the bottom of the page|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00ab0084-0049-00f9-007c-0046003500a6.png",
        "timestamp": 1585941709756,
        "duration": 21
    },
    {
        "description": "Click the \"Show more\" -Button|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d5001d-005f-004e-003d-00c300800026.png",
        "timestamp": 1585941710450,
        "duration": 5107
    },
    {
        "description": "Scroll back to the top and enter valid data into the \"Location\"-Inputfield|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b200f3-001a-00f1-00f9-00fb002000d2.png",
        "timestamp": 1585941716120,
        "duration": 890
    },
    {
        "description": "Check the \"Online Bookable“-Checkbox|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004e00e6-0099-0030-0053-002e00e90025.png",
        "timestamp": 1585941717708,
        "duration": 141
    },
    {
        "description": "Click the \"Search-Button i.e with \" again|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d40073-00f3-0046-0031-008a00420043.png",
        "timestamp": 1585941718548,
        "duration": 5091
    },
    {
        "description": "Searching with Video Conference availability of Doc|search-result",
        "passed": false,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": [
            "Expected false to be truthy.",
            "Expected false to be truthy.",
            "Expected false to be truthy.",
            "Expected false to be truthy.",
            "Expected false to be truthy.",
            "Expected false to be truthy."
        ],
        "trace": [
            "Error: Failed expectation\n    at SearchPage.SearchVideoConfAvailability (/Users/junaidkhan/clickdoc-bak/outputjs/Pages/SearchPage.js:158:118)\n    at UserContext.<anonymous> (/Users/junaidkhan/clickdoc-bak/outputjs/specs/PhysicianSearch-Test.js:90:20)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2974:25",
            "Error: Failed expectation\n    at SearchPage.SearchVideoConfAvailability (/Users/junaidkhan/clickdoc-bak/outputjs/Pages/SearchPage.js:160:41)\n    at UserContext.<anonymous> (/Users/junaidkhan/clickdoc-bak/outputjs/specs/PhysicianSearch-Test.js:90:20)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2974:25",
            "Error: Failed expectation\n    at SearchPage.SearchVideoConfAvailability (/Users/junaidkhan/clickdoc-bak/outputjs/Pages/SearchPage.js:161:96)\n    at UserContext.<anonymous> (/Users/junaidkhan/clickdoc-bak/outputjs/specs/PhysicianSearch-Test.js:90:20)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2974:25",
            "Error: Failed expectation\n    at SearchPage.SearchVideoConfAvailability (/Users/junaidkhan/clickdoc-bak/outputjs/Pages/SearchPage.js:162:112)\n    at UserContext.<anonymous> (/Users/junaidkhan/clickdoc-bak/outputjs/specs/PhysicianSearch-Test.js:90:20)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2974:25",
            "Error: Failed expectation\n    at SearchPage.SearchVideoConfAvailability (/Users/junaidkhan/clickdoc-bak/outputjs/Pages/SearchPage.js:163:96)\n    at UserContext.<anonymous> (/Users/junaidkhan/clickdoc-bak/outputjs/specs/PhysicianSearch-Test.js:90:20)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2974:25",
            "Error: Failed expectation\n    at SearchPage.SearchVideoConfAvailability (/Users/junaidkhan/clickdoc-bak/outputjs/Pages/SearchPage.js:165:41)\n    at UserContext.<anonymous> (/Users/junaidkhan/clickdoc-bak/outputjs/specs/PhysicianSearch-Test.js:90:20)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:112:25\n    at new ManagedPromise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:1077:7)\n    at ControlFlow.promise (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2505:12)\n    at schedulerExecute (/Users/junaidkhan/clickdoc-bak/node_modules/jasminewd2/index.js:95:18)\n    at TaskQueue.execute_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3084:14)\n    at TaskQueue.executeNext_ (/Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:3067:27)\n    at /Users/junaidkhan/clickdoc-bak/node_modules/selenium-webdriver/lib/promise.js:2974:25"
        ],
        "browserLogs": [],
        "screenShotFile": "006c00f3-00e6-00ef-00c9-0010004200d8.png",
        "timestamp": 1585941724210,
        "duration": 50722
    },
    {
        "description": "Searching with Barrier Free|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a200df-00e7-0030-0076-002700820046.png",
        "timestamp": 1585941775492,
        "duration": 7153
    },
    {
        "description": "Search Sorting with Aplhabatically A-Z|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00530058-00e4-0031-0063-004b00c50021.png",
        "timestamp": 1585941783389,
        "duration": 15098
    },
    {
        "description": "Search Sorting with Aplhabatically Z-A|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00b50039-0034-0026-0027-00da00a60001.png",
        "timestamp": 1585941799070,
        "duration": 15060
    },
    {
        "description": "Drag range slider without releasing it|search-result",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 51578,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.163"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "0093001b-006e-0065-000f-0010009d000f.png",
        "timestamp": 1585941814711,
        "duration": 35875
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
