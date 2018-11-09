function init() {
    var imageObj = new Image();
    
    images = new Array(
        "../images/welcome_text.png",
        "../images/about_text.png",
        "../images/projects_text.png",
        "../images/journals_text.png"
    );
    
    for(i=0; i < images.length; i++) {
        imageObj.src = images[i];
    }
}

var toCapWords = function(str)
{
    var ret = str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase()
                + txt.substr(1).toLowerCase();
    });
    
    return ret;
}
