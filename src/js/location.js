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
