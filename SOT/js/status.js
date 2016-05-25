function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(true);
        }
    }
    xhr.onerror = function(){
        callback(false);
    }
    xhr.send();
}

httpRequest('http://oa.sumavision.com/', function(status){
        chrome.browserAction.setIcon({path: (status?'image/online38.png':'image/offline38.png')});
});

setInterval(function(){
    httpRequest('http://oa.sumavision.com/', function(status){
        chrome.browserAction.setIcon({path: (status?'image/online38.png':'image/offline38.png')});
    });
},10000);

