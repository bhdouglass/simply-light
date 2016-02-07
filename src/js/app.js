var conf = require('conf');
var weather = require('weather');
var aqi = require('aqi');
var enums = require('enums');
var util = require('util');
var appinfo = require('appinfo');
var MessageQueue = require('libs/js-message-queue');

Pebble.addEventListener('ready', function(e) {
    console.log('starting js, v' + appinfo.versionCode);

    conf.loadConfig();
    console.log(JSON.stringify(conf.config));
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

    var url = '<%= config_url %>?platform=' + platform + '&version=' + appinfo.versionCode + '#' + encodeURIComponent(JSON.stringify(conf.config));
    Pebble.openURL(url);
    console.log(url);
});

Pebble.addEventListener('webviewclosed', function(e) {
    if (e.response == 'cancel') {
        console.log('config canceled');
    }
    else {
        var config = JSON.parse(decodeURIComponent(e.response));
        for (var key in config) {
            conf.config[key] = config[key];
        }

        console.log(JSON.stringify(conf.config));

        conf.saveConfig();
        fetch();
    }
});

function fetch() {
    if (conf.config.location && conf.config.weather_provider != 1 && conf.config.air_quality === 0) {
        weather.fetchWeather(null, fetchWeatherCallback);
    }
    else {
        util.fetchLocation(function(pos) {
            weather.fetchWeather(pos, fetchWeatherCallback);
        }, function(err) {
            MessageQueue.sendAppMessage({
                temperature: -999,
                condition: -999,
                air_quality_index: -999,
                err: enums.LOCATION_ERROR,
            }, util.ack, util.nack);
        });
    }
}

function fetchWeatherCallback(pos, data) {
    data.air_quality_index = -999;
    if (conf.config.air_quality) {
        aqi.fetchAirQuality(pos, data, fetchAirQualityCallback);
    }
    else {
        MessageQueue.sendAppMessage(data, util.ack, util.nack);
    }
}

function fetchAirQualityCallback(pos, data) {
    MessageQueue.sendAppMessage(data, util.ack, util.nack);
}
