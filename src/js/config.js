var config = {
    temperature_units: 'imperial',
    refresh_time: 30,
    wait_time: 1,
    location: '',
    show_am_pm: 0,
    hide_battery: 0,
    weather_provider: YRNO,
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
    air_quality_location: '',
    hourly_vibrate: 0,
    openweathermap_api_key: '',
    forcastio_api_key: '',
};

var configInts = [
    'refresh_time', 'wait_time', 'show_am_pm', 'hide_battery', 'weather_provider',
    'feels_like', 'vibrate_bluetooth', 'charging_icon', 'bt_disconnect_icon',
    'battery_percent', 'day_text_color', 'day_background_color',
    'night_text_color', 'night_background_color', 'language', 'layout',
    'air_quality', 'aqi_degree', 'hourly_vibrate',
];

function ack(e) {
    console.log('Successfully delivered message with transactionId=' + e.data.transactionId);
}

function nack(e) {
    console.log('Unable to deliver message with transactionId=' + e.data.transactionId + ', error is: ' + e.error.message);
}

function loadConfig() {
    for (var key in config) {
        var value = window.localStorage.getItem(key);
        if (value !== null) {
            if (configInts.indexOf(key) >= 0) {
                config[key] = parseInt(value);
            }
            else {
                config[key] = value;
            }
        }
    }

    if (
        config.weather_provider !== OPENWEATHERMAP &&
        config.weather_provider != YAHOO &&
        config.weather_provider != YRNO &&
        config.weather_provider != FORCASTIO
    ) {
        config.weather_provider = YRNO;
        saveSingleConfig('weather_provider');
        console.log('fixing weather_provider');
    }

    MessageQueue.sendAppMessage({
        refresh_time: config.refresh_time,
        wait_time: config.wait_time,
        show_am_pm: config.show_am_pm,
        hide_battery: config.hide_battery,
        vibrate_bluetooth: config.vibrate_bluetooth,
        charging_icon: config.charging_icon,
        bt_disconnect_icon: config.bt_disconnect_icon,
        battery_percent: config.battery_percent,
        day_text_color: config.day_text_color,
        day_background_color: config.day_background_color,
        night_text_color: config.night_text_color,
        night_background_color: config.night_background_color,
        language: config.language,
        layout: config.layout,
        air_quality: config.air_quality,
        aqi_degree: config.aqi_degree,
        hourly_vibrate: config.hourly_vibrate,
    }, ack, nack);
}

function saveConfig() {
    for (var key in config) {
        saveSingleConfig(key);
    }

    MessageQueue.sendAppMessage({
        refresh_time: config.refresh_time,
        wait_time: config.wait_time,
        show_am_pm: config.show_am_pm,
        hide_battery: config.hide_battery,
        vibrate_bluetooth: config.vibrate_bluetooth,
        charging_icon: config.charging_icon,
        bt_disconnect_icon: config.bt_disconnect_icon,
        battery_percent: config.battery_percent,
        day_text_color: config.day_text_color,
        day_background_color: config.day_background_color,
        night_text_color: config.night_text_color,
        night_background_color: config.night_background_color,
        language: config.language,
        layout: config.layout,
        air_quality: config.air_quality,
        aqi_degree: config.aqi_degree,
        hourly_vibrate: config.hourly_vibrate,
    }, ack, nack);
}

function saveSingleConfig(key) {
    window.localStorage.setItem(key, config[key]);
}
