var MessageQueue = require('libs/js-message-queue');
var constants = require('constants');

var configuration = {
    temperature_units: 'imperial',
    refresh_time: 30,
    wait_time: 1,
    show_am_pm: 0,
    hide_battery: 0,
    weather_provider: constants.YRNO,
    feels_like: 0,
    vibrate_bluetooth: 0,
    charging_icon: 1,
    bt_disconnect_icon: 0,
    battery_percent: 0,
    day_text_color: 0,
    day_background_color: 1,
    night_text_color: 0,
    night_background_color: 1,
    language: 0,
    layout: 0,
    air_quality: 0,
    last_aqi_location: null,
    aqi_degree: 0,
    hourly_vibrate: 0,
    openweathermap_api_key: '',
    forecastio_api_key: '',
};

var configurationInts = [
    'refresh_time', 'wait_time', 'show_am_pm', 'hide_battery', 'weather_provider',
    'feels_like', 'vibrate_bluetooth', 'charging_icon', 'bt_disconnect_icon',
    'battery_percent', 'day_text_color', 'day_background_color',
    'night_text_color', 'night_background_color', 'language', 'layout',
    'air_quality', 'aqi_degree', 'hourly_vibrate',
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
        show_am_pm: configuration.show_am_pm,
        hide_battery: configuration.hide_battery,
        vibrate_bluetooth: configuration.vibrate_bluetooth,
        charging_icon: configuration.charging_icon,
        bt_disconnect_icon: configuration.bt_disconnect_icon,
        battery_percent: configuration.battery_percent,
        day_text_color: configuration.day_text_color,
        day_background_color: configuration.day_background_color,
        night_text_color: configuration.night_text_color,
        night_background_color: configuration.night_background_color,
        language: configuration.language,
        layout: configuration.layout,
        air_quality: configuration.air_quality,
        aqi_degree: configuration.aqi_degree,
        hourly_vibrate: configuration.hourly_vibrate,
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
