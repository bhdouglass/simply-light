function fetchAirQuality(pos, data, callback) {
    //full detail: http://mapidroid.aqicn.org/aqicn/json/android/_Cw121A9IzcsrrswpS8zLTNR3zCnJz89LBAA/v9.json?cityID=USA%3APennsylvania%2FAltoona&lang=en
    var url = 'http://mapidroid.aqicn.org/aqicn/services/geolocate/?autolocate&android&geo=1;' +
        pos.coords.latitude + ';' + pos.coords.longitude + ';' + pos.coords.accuracy + ';gps&lang=en';

    console.log(url);
    get(url, function(response) {
        var json = JSON.parse(response);

        if (json.length > 0) {
            console.log('aqi: ' + json[0].v);
            console.log('loc: ' + json[0].nlo);

            data.air_quality_index = parseInt(json[0].v);
            callback(pos, data);
        }
        else {
            data.air_quality_index = -999;
            callback(pos, data);
        }

    }, function(err) {
        console.warn('Error while getting air quality: ' + err.status);

        data.air_quality_index = -999;
        callback(pos, data);
    });
}
