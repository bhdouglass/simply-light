Pebble.addEventListener('ready', function(e) {
    console.log('starting js, v' + appinfo.versionCode);
    log(LOG_APP_START);

    loadConfig();
    loadLog();
    console.log(JSON.stringify(config));
    fetchLocation();
});

Pebble.addEventListener('appmessage', function(e) {
    console.log('Received message: ' + JSON.stringify(e.payload));
    if (e.payload.fetch) {
        log(LOG_FETCH_MESSAGE);

        fetchLocation();
    }
});

Pebble.addEventListener('showConfiguration', function(e) {
    log(LOG_CONFIGURATION);

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
        log(LOG_CONFIGURATION_CANCELED);
        console.log('config canceled');
    }
    else {
        log(LOG_CONFIGURATION_CLOSE);

        config = JSON.parse(decodeURIComponent(e.response));
        console.log(JSON.stringify(config));

        saveConfig();
        fetchLocation();
    }
});

function fetchLocation() {
    log(LOG_FETCH_LOCATION);

    window.navigator.geolocation.getCurrentPosition(function(pos) { //Success
        log(LOG_LOCATION_SUCCESS);

        console.log('lat: ' + pos.coords.latitude);
        console.log('lng: ' + pos.coords.longitude);

        fetchWeather(pos);

    }, function(err) { //Error
        log(LOG_LOCATION_ERROR);
        locationErrorCode(err.code);

        console.warn('location error: ' + err.code + ' - ' + err.message);

        MessageQueue.sendAppMessage({
            temperature: -999,
            condition: -999,
            air_quality_index: -999,
            err: LOCATION_ERROR,
        }, ack, nack);

    }, { //Options
        timeout: 30000, //30 seconds
        maximumAge: 300000, //5 minutes
    });
}


function fetchWeather(pos) {
    log(LOG_FETCH_WEATHER);

    var wm = null;
    if (config.weather_provider === OPENWEATHERMAP) {
        var api_key = 'ce255d859db621b13bb985a4e06a4a18';
        if (config.openweathermap_api_key && config.openweathermap_api_key.length > 0) {
            api_key = config.openweathermap_api_key;
        }
        wm = new WeatherMan(WeatherMan.OPENWEATHERMAP, api_key);

        log(LOG_OPENWEATHERMAP);
    }
    else if (config.weather_provider === YAHOO) {
        wm = new WeatherMan(WeatherMan.YAHOO);

        log(LOG_YAHOO_WEATHER);
    }
    else if (config.weather_provider === FORECASTIO) {
        if (config.forecastio_api_key && config.forecastio_api_key.length > 0) {
            wm = new WeatherMan(WeatherMan.FORECASTIO, config.forecastio_api_key);

            log(LOG_FORECASTIO_WEATHER);
        }
        else {
            console.warn('No forecast.io api key');
            log(LOG_FORECASTIO_NO_KEY);
        }
    }
    else {
        wm = new WeatherMan(WeatherMan.YRNO);

        log(LOG_YRNO_WEATHER);
    }

    if (wm) {
        wm.getCurrent(pos.coords.latitude, pos.coords.longitude).then(function(result) {
            log(LOG_WEATHER_SUCCESS);

            var units = WeatherMan.KELVIN;
            if (config.temperature_units == 'imperial') {
                units = WeatherMan.FAHRENHEIT;
            }
            else if (config.temperature_units == 'metric') {
                units = WeatherMan.CELCIUS;
            }

            var temp = result.getTemperature(units);
            if (config.feels_like == 1) {
                temp = result.getWindChill(units);
            }
            else if (config.feels_like == 2) {
                temp = result.getHeatIndex(units);
            }

            var condition = result.getCondition();
            var conditions = {};
            conditions[WeatherMan.CLEAR] = CLEAR;
            conditions[WeatherMan.CLOUDY] = CLOUDY;
            conditions[WeatherMan.FOG] = FOG;
            conditions[WeatherMan.LIGHT_RAIN] = LIGHT_RAIN;
            conditions[WeatherMan.RAIN] = RAIN;
            conditions[WeatherMan.THUNDERSTORM] = THUNDERSTORM;
            conditions[WeatherMan.SNOW] = SNOW;
            conditions[WeatherMan.HAIL] = HAIL;
            conditions[WeatherMan.WIND] = WIND;
            conditions[WeatherMan.EXTREME_WIND] = EXTREME_WIND;
            conditions[WeatherMan.TORNADO] = TORNADO;
            conditions[WeatherMan.HURRICANE] = HURRICANE;
            conditions[WeatherMan.EXTREME_COLD] = EXTREME_COLD;
            conditions[WeatherMan.EXTREME_HEAT] = EXTREME_HEAT;
            conditions[WeatherMan.SNOW_THUNDERSTORM] = SNOW_THUNDERSTORM;

            fetchAirQuality(pos, {
                temperature: temp,
                condition: conditions[condition] ? conditions[condition] : CLEAR,
                sunrise: result.getSunrise(),
                sunset: result.getSunset(),
                err: NO_ERROR,
            });

        }).catch(function(result) {
            log(LOG_WEATHER_ERROR);

            if (result && result.status) {
                statusCode(result.status);
            }

            fetchAirQuality(pos, {
                temperature: -999,
                condition: -999,
                err: WEATHER_ERROR,
            });
        });
    }
    else {
        fetchAirQuality(pos, {
            temperature: -999,
            condition: -999,
            err: WEATHER_ERROR,
        });
    }
}

function fetchAirQuality(pos, data) {
    data.air_quality_index = -999;
    if (config.air_quality) {
        log(LOG_FETCH_AQI);

        var wm = new WeatherMan(WeatherMan.AQICN);
        wm.getCurrent(pos.coords.latitude, pos.coords.longitude).then(function(result) {
            log(LOG_AQI_SUCCESS);

            config.last_aqi_location = result.getLocation();
            saveSingleConfig('last_aqi_location');

            data.air_quality_index = result.getAQI();
            MessageQueue.sendAppMessage(data, ack, nack);

        }).catch(function() {
            log(LOG_AQI_ERROR);

            data.air_quality_index = -999;
            data.err = AQI_ERROR;

            if (result && result.status) {
                statusCode(result.status);
            }

            MessageQueue.sendAppMessage(data, ack, nack);
        });
    }
    else {
        log(LOG_NO_FETCH_AQI);
        MessageQueue.sendAppMessage(data, ack, nack);
    }
}
