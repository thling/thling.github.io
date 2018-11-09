/**
 * Keeps track of the current section
 */
var currentSection = 1;

/**
 * Defines the maximum sections available
 */
var maxSectionCount = 0;

/**
 * Define section name to number here
 */
var sectionNumbersMapping = {};

/**
 * Mutual exclusion lock for loadMore
 * and loadBack functions to prevent from
 * overly loading (loading non existing sections).
 */
var mutex = false;

/**
 * Animation duration (how long for the animation to complete)
 * In milliseconds
 */
var animationDuration = 150;

/**
 * Mutual Exclusion timeout
 * In milliseconds
 */
var mutexTimeout = 0;

/**
 * Retrieves the list of parameters in URL.
 * 
 * Example: http://host/about?section=test,count=3
 * getParams will return the following for the above URL:
 *      array: { 
 *        "section": "test",
 *        "count": "3"
 *      }
 */
var getParams = function() {
    var params = document.URL.split("?");
    if (params[1] == null || params[1] == "") {
        return false;
    } else {
        params = params[1].split(",");
    }
    
    var paramList = {};
    
    for (var i = 0; i < params.length; i++) {
        var arg = params[i].split("=");
        paramList[arg[0]] = arg[1];
    }
    
    return paramList;
}

/**
 * Uses the array returned by getParams and
 * retrieve a value with the provided key.
 *
 * Example: http://host/about?section=test,count=3
 * getParam("section") will return the following
 * for the above URL:
 *      "test"
 */
var getParam = function(key) {
    var params = getParams();
    if (!params) {
        return false;
    } else {
        var value = params[key];
        if (value != null && value != "") {
            return value;
        } else {
            return false;
        }
    }
}

/**
 * Uses loadMore function to keep loading
 * until the specified section number
 */
var loadUntil = function(sectionNumber) {
    if (sectionNumber == "1") {
        return;
    }
    
    setTimeout(function() {
        loadMore();
        loadUntil(sectionNumber - 1);
    }, animationDuration * 2 + 50);
}

/**
 * Run when document finishes loading
 */
$(document).ready(function() {
    // Binds to window.onload; when this finishes,
    // all resources used in the page have been loaded.
    $(window).bind('load', function() {
        // Shift sections to out of the window edge
        // and hide them
        for (var i = 2; i <= maxSectionCount; i++) {
            $("#section" + i).css({
                'marginLeft': $(window).width() + "px",
                'display': 'none'
            });
        }
        
        $(".navigator").delay(1500).animate({
            opacity: 0.2
        }, 300);
        
        // First section cannot go back anymore, hide Back button
        $("#navBack").css('display', 'none');
        
        // Gets the requested section. If non provided,
        // first section is displayed; otherwise, use
        // loadMore to animate
        var snum = sectionNumbersMapping[getParam('section')];
        if (snum != null && snum > 1) {
            // Wait 500 milliseconds so things are loaded properly
            setTimeout(function() {
                loadUntil(snum);
            }, 1000 - (animationDuration * 2 + mutexTimeout * 2));
        }
        
        // Check if the user has used the navigator before.
        // If not, show a tutorial and set a cookie to hide 
        // for one year
        if (!checkCookieSetOnFail()) {
            $("#tips").delay(1000).slideDown(300);
            
            $("#tips").bind("click", function() {
                $("#tips").slideUp(300);
            });
        }
    });
    
    // Allows navigation with arrow keys
    $(window).bind('keyup', function(event) {
        if (event.keyCode == 39) {
            // Right arrow key
            loadMore();
        } else if (event.keyCode == 37) {
            // Left arrow key
            loadBack();
        }
    });
    
    $(".navigator").bind({
        'mouseover':
            function() {
                $(this).animate({
                    opacity: 0.8
                }, animationDuration);
            },
        'mouseout':
            function() {
                $(this).animate({
                    opacity: 0.2
                }, animationDuration);
            }
    });
});

/**
 * Sets cookie to indicate that the navigation guide
 * have been seen. If cookie is already set, return false.
 */
var checkCookieSetOnFail = function() {
    var i, x, y, ARRcookies = document.cookie.split(";");
    var qtipCookie = null;
    
    for (i=0; i < ARRcookies.length ; i++) {
        // Get cookies array
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == "navigation_qtip") {
            qtipCookie = unescape(y);
        }
    }
    
    // Set cookie
    if (qtipCookie == null || qtipCookie == "") {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + 365);
        
        var c_value = "true; expires=" + exdate.toUTCString() + "; path=/";
        
        document.cookie = "navigation_qtip=" + c_value;
        
        return false;
    } else {
        return true;
    }
}

/**
 * Loads next section.
 * Returns if loading is locked or at last section.
 */
var loadMore = function() {
    if (mutex || currentSection == maxSectionCount) {
        return;
    } else {
        // Acquire lock
        mutex = true;
    }
    
    var sectionWidth = $("#contents_cover").width() - 40 + "px";
    var contentsCoverObj = $("#contents_cover");
    var currSectionObj = $("#section" + currentSection);
    var nextSectionObj = $("#section" + (currentSection + 1));
    
    // To prevent text from resizing during animation
    contentsCoverObj.css('overflow', 'hidden');
    
    // Calculates section width according to current window size.
    currSectionObj.css('width', sectionWidth);
    
    // Animate; slide the current section to left
    // and slide the next section in from right.
    currSectionObj.animate({
        marginLeft: "-=" + sectionWidth,
        opacity: 0
    },animationDuration , function() {
        currSectionObj.css('display', 'none');
        nextSectionObj.css({
            'display': '',
            'width': sectionWidth
        });

        nextSectionObj.animate({
            marginLeft: "0px",
            opacity: 1
        },animationDuration , function() {
            nextSectionObj.css('width', '');
            contentsCoverObj.css('overflow', 'visible');
            currentSection += 1;
            
            if (currentSection == maxSectionCount) {
                $("#navMore").fadeOut(animationDuration);
            }
            
            if ($("#navBack").css('display') == 'none') {
                $("#navBack").fadeIn(animationDuration);
            }
            
            mutex = false;
            $(window).trigger('resize');
        });
    });
}

/**
 * Loads previous section.
 * Returns if loading is locked or at first section.
 */
var loadBack = function() {
    if (mutex || currentSection == 1) {
        return;
    } else {
        // Acquire lock
        mutex = true;
    }
    
    var sectionWidth = $("#contents_cover").width() - 40 + "px";
    var contentsCoverObj = $("#contents_cover");
    var currSectionObj = $("#section" + currentSection);
    var prevSectionObj = $("#section" + (currentSection - 1));
    
    // To prevent text from resizing during animation
    contentsCoverObj.css('overflow', 'hidden');
    
    // Calculates section width according to current window size.
    currSectionObj.css('width', sectionWidth);
    
    // Animate; slide the current section to right
    // and slide the next section in from left
    currSectionObj.animate({
        marginLeft: "+=" + (sectionWidth),
        opacity: 0
    },animationDuration , function() {
        currSectionObj.css('display', 'none');
        prevSectionObj.css({
            'display': '',
            'width': sectionWidth
        });

        prevSectionObj.animate({
            marginLeft: "0px",
            opacity: 1
        },animationDuration ,function() {
            prevSectionObj.css('width', '');
            contentsCoverObj.css('overflow', 'visible');
            currentSection -= 1;
            
            if (currentSection == 1) {
                $("#navBack").fadeOut(animationDuration);
            }
            
            if ($("#navMore").css('display') == 'none') {
                $("#navMore").fadeIn(animationDuration);
            }
            
            mutex = false;
            $(window).trigger('resize');
        });
    });
}
