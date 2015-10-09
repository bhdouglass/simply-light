Pebble.addEventListener('ready', function(e) {
    console.log('starting js, v' + appinfo.versionCode);

    loadConfig();
    console.log(JSON.stringify(config));
});

Pebble.addEventListener('appmessage', function(e) {
    console.log('Received message: ' + JSON.stringify(e.payload));
    if (e.payload.fetch) {
        fetch();
    }
});

Pebble.addEventListener('showConfiguration', function(e) {
    var platform = 'aplite';
    if (Pebble.getActiveWatchInfo) {
        platform = Pebble.getActiveWatchInfo().platform;
    }

    var url = '<%= config_url %>?platform=' + platform + '&version=' + appinfo.versionCode + '#' + encodeURIComponent(JSON.stringify(config));
    Pebble.openURL(url);
    console.log(url);
});

Pebble.addEventListener('webviewclosed', function(e) {
    if (e.response == 'cancel') {
        console.log('config canceled');
    }
    else {
        config = JSON.parse(decodeURIComponent(e.response));
        console.log(JSON.stringify(config));

        saveConfig();
        fetch();
    }
});

function fetch() {
    if (config.location && config.weather_provider != 1 && config.air_quality === 0) {
        fetchWeather(null, fetchWeatherCallback);
    }
    else {
        fetchLocation(function(pos) {
            fetchWeather(pos, fetchWeatherCallback);
        }, function(err) {
            MessageQueue.sendAppMessage({
                temperature: -999,
                condition: -999,
                air_quality_index: -999,
                err: LOCATION_ERROR,
            }, ack, nack);
        });
    }
}

function fetchWeatherCallback(pos, data) {
    data.air_quality_index = -999;
    if (config.air_quality) {
        fetchAirQuality(pos, data, fetchAirQualityCallback);
    }
    else {
        MessageQueue.sendAppMessage(data);
    }
}

function fetchAirQualityCallback(pos, data) {
    MessageQueue.sendAppMessage(data);
}
