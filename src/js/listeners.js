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

function fetchWeather(pos, callback) {
    log(LOG_FETCH_WEATHER);
    var wm = null;
    if (config.weather_provider === OPENWEATHERMAP) {
        log(LOG_OPENWEATHERMAP);

        var api_key = 'ce255d859db621b13bb985a4e06a4a18';
        if (config.openweathermap_api_key && config.openweathermap_api_key.length > 0) {
            api_key = config.openweathermap_api_key;
        }
        wm = new WeatherMan(WeatherMan.OPENWEATHERMAP, api_key);
    }
    else if (config.weather_provider === YAHOO) {
        log(LOG_YAHOOWEATHER);

        wm = new WeatherMan(WeatherMan.YAHOO);
    }
    else if (config.weather_provider === FORECASTIO) {
        log(LOG_FORECASTIOWEATHER);

        if (config.forecastio_api_key && config.forecastio_api_key.length > 0) {
            wm = new WeatherMan(WeatherMan.FORECASTIO, config.forecastio_api_key);
        }
        else {
            console.warn('No forecast.io api key');

            log(LOG_FORECASTIO_NO_KEY);
            callback(pos, {
                temperature: -999,
                condition: -999,
                err: WEATHER_ERROR,
            });
        }
    }
    else {
        log(LOG_YRNOWEATHER);

        wm = new WeatherMan(WeatherMan.YRNO);
    }

    if (wm) {
        log(LOG_FETCH_WEATHER2);
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

            callback(pos, {
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

            callback(pos, {
                temperature: -999,
                condition: -999,
                err: WEATHER_ERROR,
            });
        });
    }
}

function fetchWeatherCallback(pos, data) {
    data.air_quality_index = -999;
    if (config.air_quality) {
        var wm = new WeatherMan(WeatherMan.AQICN);
        wm.getCurrent(pos.coords.latitude, pos.coords.longitude).then(function(result) {
            log(LOG_AQI_SUCCESS);

            config.last_aqi_location = result.getLocation();
            saveSingleConfig('last_aqi_location');

            data.air_quality_index = result.getAQI();
            fetchAirQualityCallback(pos, data);
        }).catch(function() {
            data.air_quality_index = -999;
            data.err = AQI_ERROR;

            if (result && result.status) {
                statusCode(result.status);
            }

            log(LOG_AQI_ERROR);
            fetchAirQualityCallback(pos, data);
        });
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
