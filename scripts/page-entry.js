var pageHeaderId = "#pageHeader";
var pageHeaderObj;
var contentsCoverObj;

var pageEntry = function(source, pageMenuId, callback) {
    contentsCoverObj = $("#contents_cover");
    pageHeaderObj = $(pageHeaderId);

    /* if (navigator.appVersion.indexOf("Windows") >= 0) {
        $(".pageLoader").css('fontWeight','300');
        contentsCoverObj.css('fontWeight','300');
    }*/
    
    showLoader();
    init();
    
    $("#menu" + toCapWords(pageMenuId)).attr('class', 'menuItem currentPage');
    $("#menu" + toCapWords(pageMenuId)).html('&rsaquo;&rsaquo; ' + pageMenuId);
    
    $(window).bind('load',
        function() {
            $("#cover").show();
            setTimeout(function() {
                hideLoader();
            },150);
            
            setTimeout(function() {
                $('body').css('backgroundImage', 'url(\'../images/background_white_to_gray.png\')');
            }, 300);
            
            pageHeaderObj.attr('src', source);
            pageHeaderObj.delay(650).animate({
                opacity: 1,
            }, 100);
            
            $("#cover").delay(650).animate({
                marginLeft: "-=15px",
                opacity: 1,
            }, 300);
            
            var windowWidth = $(window).width() - 261;
            contentsCoverObj.css("width", windowWidth + "px");
            
            if ((navigator.userAgent).indexOf('Gecko') < 0
                    && (navigator.userAgent.indexOf('WebKit') < 0)) {
                var notSupportedPrompt = $(document.createElement('div'));
                notSupportedPrompt.css({
                    'position': 'fixed',
                    'bottom': '10px',
                    'left': '10px',
                    'width': '220px',
                    'padding': '5px 10px 5px 10px',
                    'backgroundColor': 'rgba(140,40,40,0.7)',
                    'color': 'white',
                    'fontFamily': 'roboto',
                    'fontSize': '14px',
                    'zIndex': '999',
                    'textAlign': 'center',
                    'cursor': 'pointer',
                    'display': 'none'
                });
                
                notSupportedPrompt.click(function() {
                    notSupportedPrompt.fadeOut(500);
                });
                
                notSupportedPrompt.html('<p>Your browser is not supported.</p>'
                        + '<p>For the best viewing experience, it is recommended to download<br/>'
                        + '<b><a target="_blank" href="http://www.google.com/chrome" '
                        + 'style="padding:0px; text-decoration: none; color:white; display:inline;">'
                        + 'Google Chrome</a></b> or <b>'
                        + '<a target="_blank" href="http://www.mozilla.org/firefox/" '
                        + 'style="padding:0px; text-decoration: none; color:white; display:inline;">'
                        + 'Mozilla Firefox</a></b>.</p>'
                        + '<p>Sorry for the inconveniences!</p>'
                        + '<hr style="width:100%" />'
                        + '<p align=center style="margin-top:0px; font-size:13px;">Click to dismiss</p>');
                
                $('body').append(notSupportedPrompt);
                
                notSupportedPrompt.delay(1000).fadeIn(500);
	        }
        }
    );
    
    
    $(window).bind('resize',
        function() {
            var windowWidth = $(window).width() - 261;
            if (windowWidth < 500) {
                return;
            }
            
            contentsCoverObj.css("width", windowWidth + "px");
        }
    );
    
    $('#loader').delay(100).fadeIn(300);
}
