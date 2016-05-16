var datalog = '';
var last_status_code = -1;
var last_location_error_code = -1;

module.exports = {
    APP_START: 'a',
    FETCH_MESSAGE: 'b',
    CONFIGURATION: 'c',
    CONFIGURATION_CANCELED: 'd',
    CONFIGURATION_CLOSE: 'e',
    FETCH_LOCATION: 'f',
    LOCATION_SUCCESS: 'g',
    LOCATION_ERROR: 'h',
    FETCH_WEATHER: 'i',
    OPENWEATHERMAP: 'j',
    YAHOO_WEATHER: 'k',
    FORECASTIO_WEATHER: 'l',
    FORECASTIO_NO_KEY: 'm',
    YRNO_WEATHER: 'n',
    WEATHER_SUCCESS: 'o',
    WEATHER_ERROR: 'p',
    FETCH_AQI: 'q',
    AQI_SUCCESS: 'r',
    AQI_ERROR: 's',
    NO_FETCH_AQI: 't',
    SKIP_FETCH: 'u',

    log: function(msg) {
        if (datalog.length > 100) {
            datalog = datalog.substring(10, datalog.length);
        }

        datalog += msg;

        window.localStorage.setItem('datalog', datalog);
    },

    getLog: function() {
        return datalog;
    },

    load: function() {
        datalog = window.localStorage.getItem('datalog');
        if (!datalog) {
            datalog = '';
        }
    },

    setStatusCode: function(code) {
        last_status_code = code;
    },

    getStatusCode: function() {
        return last_status_code;
    },

    setLocationErrorCode: function(code) {
        last_location_error_code = code;
    },

    getLocationErrorCode: function() {
        return last_location_error_code;
    },
};
