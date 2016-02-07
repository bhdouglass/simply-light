function fetchLocation(callback, errCallback) {
    console.log('fetching location');
    window.navigator.geolocation.getCurrentPosition(function(pos) { //Success
        console.log('lat: ' + pos.coords.latitude);
        console.log('lng: ' + pos.coords.longitude);

        callback(pos);

    }, function(err) { //Error
        console.warn('location error: ' + err.code + ' - ' + err.message);
        if (errCallback) {
            errCallback(err);
        }

    }, { //Options
        timeout: 15000,
        maximumAge: 60000
    });
}

function get(url, callback, errCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    if (callback) {
        req.onload = function(e) {
            if (req.readyState === 4) {
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
            errCallback(req);
        };
    }

    req.send();
    return req;
}

function ack(e) {
    console.log('Successfully delivered message with transactionId=' + e.data.transactionId);
}

function nack(e) {
    console.log('Unable to deliver message with transactionId=' + e.data.transactionId + ', error is: ' + e.error.message);
}

module.exports.fetchLocation = fetchLocation;
module.exports.get = get;
module.exports.ack = ack;
module.exports.nack = nack;