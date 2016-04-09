var MessageQueue = require('libs/js-message-queue');
var constants = require('constants');

var platform = 'aplite';
if (Pebble.getActiveWatchInfo) {
    platform = Pebble.getActiveWatchInfo().platform;
}

var configuration = {
    temperature_units: 'imperial',
    refresh_time: 30,
    wait_time: 1,
    hide_battery: 0,
    weather_provider: constants.YRNO,
    feels_like: 0,
    vibrate_bluetooth: 0,
    day_text_color: 0,
    day_background_color: 1,
    night_text_color: 0,
    night_background_color: 1,
    language: 0,
    layout: 0,
    air_quality: 0,
    last_aqi_location: null,
    hourly_vibrate: 0,
    openweathermap_api_key: '',
    forecastio_api_key: '',
    show_status_bar: 1,
    status_bar_day_color: 0,
    status_bar_day_text_color: 1,
    status_bar_night_color: 0,
    status_bar_night_text_color: 1,
    status_bar1: constants.STATUS_BAR_EMPTY,
    status_bar2: constants.STATUS_BAR_EMPTY,
    status_bar3: constants.STATUS_BAR_EMPTY,
};

if (platform != 'aplite') {
    configuration.status_bar_day_color = 65535; //Cyan
    configuration.status_bar_day_text_color = 5592405; //Dark Gray
    configuration.status_bar_night_color = 65535; //Cyan
    configuration.status_bar_night_text_color = 5592405; //Dark Gray
}

var configurationInts = [
    'refresh_time',
    'wait_time',
    'hide_battery',
    'weather_provider',
    'feels_like',
    'vibrate_bluetooth',
    'battery_percent',
    'day_text_color',
    'day_background_color',
    'night_text_color',
    'night_background_color',
    'language',
    'layout',
    'air_quality',
    'hourly_vibrate',
    'show_status_bar',
    'status_bar_day_color',
    'status_bar_day_text_color',
    'status_bar_night_day_color',
    'status_bar_night_text_color',
    'status_bar1',
    'status_bar2',
    'status_bar3',
];

function ack(e) {
    console.log('Successfully delivered config message with transactionId=' + e.data.transactionId);
}

function nack(e) {
    console.log('Unable to deliver config message with transactionId=' + e.data.transactionId + ', error is: ' + e.error.message);
}

function send() {
    MessageQueue.sendAppMessage({
        refresh_time: configuration.refresh_time,
        wait_time: configuration.wait_time,
        hide_battery: configuration.hide_battery,
        vibrate_bluetooth: configuration.vibrate_bluetooth,
        day_text_color: configuration.day_text_color,
        day_background_color: configuration.day_background_color,
        night_text_color: configuration.night_text_color,
        night_background_color: configuration.night_background_color,
        language: configuration.language,
        layout: configuration.layout,
        air_quality: configuration.air_quality,
        hourly_vibrate: configuration.hourly_vibrate,
        show_status_bar: configuration.show_status_bar,
        status_bar_day_color: configuration.status_bar_day_color,
        status_bar_day_text_color: configuration.status_bar_day_text_color,
        status_bar_night_color: configuration.status_bar_night_color,
        status_bar_night_text_color: configuration.status_bar_night_text_color,
        status_bar1: configuration.status_bar1,
        status_bar2: configuration.status_bar2,
        status_bar3: configuration.status_bar3,
    }, ack, nack);
}

function load() {
    for (var key in configuration) {
        var value = window.localStorage.getItem(key);
        if (value !== null) {
            if (configurationInts.indexOf(key) >= 0) {
                configuration[key] = parseInt(value);
            }
            else {
                configuration[key] = value;
            }
        }
    }

    console.log(JSON.stringify(configuration));
}

function save(new_configuration) {
    for (var key in new_configuration) {
        configuration[key] = new_configuration[key];
        saveSingle(key);
    }

    console.log(JSON.stringify(configuration));
}

function saveSingle(key) {
    window.localStorage.setItem(key, configuration[key]);
}

module.exports = {
    configuration: configuration,
    send: send,
    load: load,
    save: save,
    saveSingle: saveSingle,
};
