function fetchLocation(callback, errCallback) {
    log(LOG_FETCH_LOCATION);
    console.log('fetching location');
    window.navigator.geolocation.getCurrentPosition(function(pos) { //Success
        console.log('lat: ' + pos.coords.latitude);
        console.log('lng: ' + pos.coords.longitude);

        log(LOG_LOCATION_SUCCESS);
        callback(pos);

    }, function(err) { //Error
        log(LOG_LOCATION_ERROR);
        locationErrorCode(err.code);

        console.warn('location error: ' + err.code + ' - ' + err.message);
        if (errCallback) {
            errCallback(err);
        }

    }, { //Options
        timeout: 20000,
        maximumAge: 60000
    });
}

function get(url, callback, errCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    if (callback) {
        req.onload = function(e) {
            if (req.readyState === 4) {
                statusCode(req.status);
                if (req.status >= 200  && req.status <= 205) {
                    callback(req.responseText);
                }
                else if (errCallback) {
                    errCallback(req);
                }
            }
        };
    }

    if (errCallback) {
        req.onerror = function(e) {
            log(LOG_GET_ERROR);
            errCallback(req);
        };
    }

    req.send();
    return req;
}
