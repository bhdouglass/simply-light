Pebble.addEventListener('ready', function(e) {
    console.log('starting js, v' + appinfo.versionCode);

    loadConfig();
    loadLog();
    console.log(JSON.stringify(config));
    fetch();
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

    var url = '<%= config_url %>?platform=' +
        platform + '&version=' + appinfo.versionCode +
        '&dl=' + datalog + '&lsc=' + last_status_code +
        '&llec=' + last_location_error_code +
        '#' + encodeURIComponent(JSON.stringify(config));
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
    log(LOG_FETCH);
    if (config.location && config.weather_provider != 1 && config.air_quality === 0) {
        fetchWeather(null, fetchWeatherCallback);
    }
    else {
        fetchLocation(function(pos) {
            log(LOG_LOCATION_CALLBACK);
            fetchWeather(pos, fetchWeatherCallback);
        }, function(err) {
            log(LOG_LOCATION_ERROR);
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
        log(LOG_WEATHER_CALLBACK);
        MessageQueue.sendAppMessage(data, ack, nack);
    }
}

function fetchAirQualityCallback(pos, data) {
    log(LOG_AIRQUALITY_CALLBACK);
    MessageQueue.sendAppMessage(data, ack, nack);
}
