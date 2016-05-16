window.location = {}; //shim for iOS
document.createElement = null; //shim to trick the browserify shims, yay! (also for iOS, yay!)

var MessageQueue = require('libs/js-message-queue');
var WeatherMan = require('libs/weather-man');
var config = require('config');
var constants = require('constants');
var logger = require('logger');

function ack(e) {
    console.log('Successfully delivered message with transactionId=' + e.data.transactionId);
}

function nack(e) {
    console.log('Unable to deliver message with transactionId=' + e.data.transactionId + ', error is: ' + e.error.message);
}

Pebble.addEventListener('ready', function(e) {
    console.log('starting js, v<%= version %>');
    logger.log(logger.APP_START);

    config.load();
    config.send();
    logger.load();
    fetchLocation();
});

Pebble.addEventListener('appmessage', function(e) {
    console.log('Received message: ' + JSON.stringify(e.payload));
    if (e.payload.fetch) {
        logger.log(logger.FETCH_MESSAGE);

        fetchLocation();
    }
});

Pebble.addEventListener('showConfiguration', function(e) {
    logger.log(logger.CONFIGURATION);

    var platform = 'aplite';
    if (Pebble.getActiveWatchInfo) {
        platform = Pebble.getActiveWatchInfo().platform;
    }

    var url = '<%= config_url %>?platform=' +
        platform + '&version=<%= version %>' +
        '&dl=' + logger.getLog() + '&lsc=' + logger.getStatusCode() +
        '&llec=' + logger.getLocationErrorCode() +
        '#' + encodeURIComponent(JSON.stringify(config.configuration));

    Pebble.openURL(url);
    console.log(url);
});

Pebble.addEventListener('webviewclosed', function(e) {
    if (!e.response || e.response == 'cancel') {
        logger.log(logger.CONFIGURATION_CANCELED);
        console.log('config canceled');
    }
    else {
        logger.log(logger.CONFIGURATION_CLOSE);

        config.save(JSON.parse(decodeURIComponent(e.response)));
        config.send();
        fetchLocation();
    }
});

function fetchLocation() {
    logger.log(logger.FETCH_LOCATION);

    window.navigator.geolocation.getCurrentPosition(function(pos) { //Success
        logger.log(logger.LOCATION_SUCCESS);

        console.log('lat: ' + pos.coords.latitude);
        console.log('lng: ' + pos.coords.longitude);

        fetchWeather(pos);

    }, function(err) { //Error
        logger.log(logger.LOCATION_ERROR);
        logger.setLocationErrorCode(err.code);

        console.warn('location error: ' + err.code + ' - ' + err.message);

        MessageQueue.sendAppMessage({
            temperature: -999,
            condition: -999,
            air_quality_index: -999,
            err: constants.LOCATION_ERROR,
        }, ack, nack);

    }, { //Options
        timeout: 30000, //30 seconds
        maximumAge: 300000, //5 minutes
    });
}

function fetchWeather(pos) {
    logger.log(logger.FETCH_WEATHER);

    var wm = null;
    if (config.configuration.weather_provider === constants.OPENWEATHERMAP) {
        var api_key = 'ce255d859db621b13bb985a4e06a4a18';
        if (config.configuration.openweathermap_api_key && config.configuration.openweathermap_api_key.length > 0) {
            api_key = config.configuration.openweathermap_api_key;
        }
        wm = new WeatherMan(WeatherMan.OPENWEATHERMAP, api_key);

        logger.log(logger.OPENWEATHERMAP);
    }
    else if (config.configuration.weather_provider === constants.YAHOO_WEATHER) {
        wm = new WeatherMan(WeatherMan.YAHOO);

        logger.log(logger.YAHOO_WEATHER);
    }
    else if (config.configuration.weather_provider === constants.FORECASTIO) {
        if (config.configuration.forecastio_api_key && config.configuration.forecastio_api_key.length > 0) {
            wm = new WeatherMan(WeatherMan.FORECASTIO, config.configuration.forecastio_api_key);

            logger.log(logger.FORECASTIO_WEATHER);
        }
        else {
            console.warn('No forecast.io api key');
            logger.log(logger.FORECASTIO_NO_KEY);
        }
    }
    else {
        wm = new WeatherMan(WeatherMan.YRNO);

        logger.log(logger.YRNO_WEATHER);
    }

    if (wm) {
        wm.getCurrent(pos.coords.latitude, pos.coords.longitude).then(function(result) {
            logger.log(logger.WEATHER_SUCCESS);

            var units = WeatherMan.KELVIN;
            if (config.configuration.temperature_units == 'imperial') {
                units = WeatherMan.FAHRENHEIT;
            }
            else if (config.configuration.temperature_units == 'metric') {
                units = WeatherMan.CELCIUS;
            }

            var temp = result.getTemperature(units);
            if (config.configuration.feels_like == 1) {
                temp = result.getWindChill(units);
            }
            else if (config.configuration.feels_like == 2) {
                temp = result.getHeatIndex(units);
            }

            var condition = result.getCondition();
            var conditions = {};
            conditions[WeatherMan.CLEAR] = constants.CLEAR;
            conditions[WeatherMan.CLOUDY] = constants.CLOUDY;
            conditions[WeatherMan.FOG] = constants.FOG;
            conditions[WeatherMan.LIGHT_RAIN] = constants.LIGHT_RAIN;
            conditions[WeatherMan.RAIN] = constants.RAIN;
            conditions[WeatherMan.THUNDERSTORM] = constants.THUNDERSTORM;
            conditions[WeatherMan.SNOW] = constants.SNOW;
            conditions[WeatherMan.HAIL] = constants.HAIL;
            conditions[WeatherMan.WIND] = constants.WIND;
            conditions[WeatherMan.EXTREME_WIND] = constants.EXTREME_WIND;
            conditions[WeatherMan.TORNADO] = constants.TORNADO;
            conditions[WeatherMan.HURRICANE] = constants.HURRICANE;
            conditions[WeatherMan.EXTREME_COLD] = constants.EXTREME_COLD;
            conditions[WeatherMan.EXTREME_HEAT] = constants.EXTREME_HEAT;
            conditions[WeatherMan.SNOW_THUNDERSTORM] = constants.SNOW_THUNDERSTORM;

            var cond = conditions[condition] ? conditions[condition] : constants.CLEAR;
            console.log('temp: ' + temp);
            console.log('condition: ' + cond + ' (' + condition + ')');
            console.log('sunrise: ' + result.getSunriseFormatted());
            console.log('sunset: ' + result.getSunsetFormatted());

            fetchAirQuality(pos, {
                temperature: temp,
                condition: cond,
                sunrise: result.getSunrise(),
                sunset: result.getSunset(),
                err: constants.NO_ERROR,
            });

        }).catch(function(result) {
            logger.log(logger.WEATHER_ERROR);
            console.warn('weather error: ' + JSON.stringify(result));

            if (result && result.status) {
                logger.setStatusCode(result.status);
            }

            fetchAirQuality(pos, {
                temperature: -999,
                condition: -999,
                err: constants.WEATHER_ERROR,
            });
        });
    }
    else {
        fetchAirQuality(pos, {
            temperature: -999,
            condition: -999,
            err: constants.WEATHER_ERROR,
        });
    }
}

function fetchAirQuality(pos, data) {
    var fetch = config.configuration.air_quality;
    for (var i = 1; i <= 5; i++) {
        if (config.configuration['status_bar' + i] == constants.STATUS_BAR_AQI) {
            fetch = true;
        }
    }

    data.air_quality_index = -999;
    if (fetch) {
        logger.log(logger.FETCH_AQI);

        var wm = new WeatherMan(WeatherMan.AQICN);
        wm.getCurrent(pos.coords.latitude, pos.coords.longitude).then(function(result) {
            logger.log(logger.AQI_SUCCESS);

            config.configuration.last_aqi_location = result.getLocation();
            config.saveSingle('last_aqi_location');

            data.air_quality_index = result.getAQI();
            MessageQueue.sendAppMessage(data, ack, nack);

        }).catch(function(result) {
            logger.log(logger.AQI_ERROR);
            console.warn('aqi error: ' + JSON.stringify(result));

            data.air_quality_index = -999;
            data.err = constants.AQI_ERROR;

            if (result && result.status) {
                logger.setStatusCode(result.status);
            }

            MessageQueue.sendAppMessage(data, ack, nack);
        });
    }
    else {
        logger.log(logger.NO_FETCH_AQI);
        MessageQueue.sendAppMessage(data, ack, nack);
    }
}
