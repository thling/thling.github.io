// Metadata
var experimentName = "Square Float Live Wallpaper";

var getDescription = function() {
        document.write("<p style='margin-top:-15px;'>"
                + "This experiment plays with the jQuery <code>animate</code> "
                + "method and randomly generates <code>div</code> elements "
                + "that cutely floats in the background. "
                + "This experiment took inspiration from the "
                + "Phase Beam live wallpaper that came with clean "
                + "Android 4.0+ installations. The live wallpaper is one "
                + "of my most favourite, and I still use it "
                + "these days.</p>");
        document.write("<p>The Square Float wallpaper uses "
                + "several calculations on timeout and floating "
                + "elements' positions relative to the edges of the window; "
                + "it is triggered with <code>goLive(obj)</code> "
                + "method, where <code>obj</code> is the element that the floating "
                + "squares will be appended to (note: their position "
                + "are still calculated with respect to window edges).</p>");
}

var getNotes = function() {
        document.write("<p style='margin-top:-15px;'>The "
                + "experiment takes a bit of time to start displaying "
                + "because I set a 'delay' to avoid generating "
                + "the cute squares too early. Please wait for "
                + "around 5 seconds to see the floating squares.</p>");
}

// Actual code
var maxSquare = 10;
var removeMutex = false;
var itmAry;

var goLive = function(onObject) {
    itmAry = new Array(maxSquare);
    for (var i = 0; i < maxSquare; i++) {
        itmAry[i] = -1;
    }
    
    setInterval(function() {
        var id = 0;
        var foundEmpty = false;
        for (id; id < maxSquare; id++) {
            if (itmAry[id] == -1) {
                foundEmpty = true;
                break;
            }
        }
        
        if (foundEmpty) {
            itmAry[id] = 0;
            var rec = getRect(id);
            $(onObject).append(rec);
            rec.fadeIn(200);
        }
        
        for (var i = 0; i < maxSquare; i++) {
            if (!$("#" + i).length) {
                continue;
            }
            if ($("#" + i).attr('animated') != "true") {
                $("#" + i).animate({
                    top: $(window).height() + $(window).scrollTop() + rec.height() + 1000 + "px",
                    left: $(window).width() + rec.width() + 1000 + "px"
                }, 50000);
                
                $("#" + i).attr('animated', "true");
            }
            
            if ($("#" + i).offset().top > $(window).height() + $(window).scrollTop()
                    || $("#" + i).offset().left > $(window).width()) {
                $("#" + i).remove();
                itmAry[i] = -1;
            }
        }
    }, 3000);
}

var getRect = function(id) {
    var rec = $(document.createElement('div'));
    rec.attr('id', id);
    
    var l = -200;
    var t = -200;
    var side = Math.random() * 10;
    if (side > 6) {
        t = Math.random() * (($(window).height() + $(window).scrollTop()) * 3 / 4);
    } else if (side <= 6 && side > 2) {
        l = Math.random() * ($(window).width() * 3 / 4);
    }
    
    rec.css({
        border: '30px solid white',
        position: "fixed",
        top: t + "px",
        left: l + "px",
        zIndex: "-999",
        opacity: "0.8",
        borderRadius: "70px",
        display: "none"
    });
    
    rec.height("150px");
    rec.width("150px");
    
    return rec;
}
