var lightColour = true;
var loaderClassName = ".pageLoader"
var loaderObj;
var timerObject;

function showLoader() {
    loaderObj = $(loaderClassName);
    loaderObj.css('lineHeight', $(window).height() + 'px');
    loaderObj.delay(50).fadeIn(200).delay(50);
    
    timerObject = setInterval(function() {
        animateLoader();
    }, 1500);
}

function hideLoader() {
    loaderObj.delay(50).fadeOut(300).queue(function() {
        clearInterval(timerObject);
        loaderObj.remove();
    });
}

function animateLoader() {
    if (lightColour) {
        loaderObj.animate({
            backgroundColor: "#444444",
            color: "white",
        }, 1000, function() {});
        
        lightColour = false;
    } else {
        loaderObj.animate({
            backgroundColor: "#dcdcdc",
            color: "black",
        }, 1000, function() {});
        
        lightColour = true;
    }
}
