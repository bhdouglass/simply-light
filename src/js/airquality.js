function fetchAirQualityHelper(pos) {
    var url = 'http://api-beta.breezometer.com/baqi/?&fields=country_aqi,country_description&key=f0035a2a68b642a59f9c2a3fe19d06a1';

    if (config.location) {
        url += '&location=' + config.location.replace(' ', '+');
    }
    else {
        url += '&lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude;
    }

    console.log(url);
    get(url, function(response) {
        var json = JSON.parse(response);

        console.log('aqi:  ' + json.country_aqi);
        console.log('desc: ' + json.country_description);

        MessageQueue.sendAppMessage({
            air_quality_index: json.country_aqi,
        }, ack, nack);

    }, function(err) {
        console.warn('Error while getting air quality: ' + err.status);

        MessageQueue.sendAppMessage({
            air_quality_index: -999,
        }, ack, nack);
    });
}

function fetchAirQuality() {
    if (config.air_quality == 1) {
        console.log('fetching air quality');

        if (config.location) {
            fetchAirQualityHelper();
        }
        else {
            fetchLocation(fetchAirQualityHelper, function(err) {
                MessageQueue.sendAppMessage({
                    air_quality_index: -998,
                }, ack, nack);
            });
        }
    }
}
