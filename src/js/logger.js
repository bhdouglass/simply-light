var LOG_APP_START = 'a';
var LOG_FETCH_MESSAGE = 'b';
var LOG_CONFIGURATION = 'c';
var LOG_CONFIGURATION_CANCELED = 'd';
var LOG_CONFIGURATION_CLOSE = 'e';
var LOG_FETCH_LOCATION = 'f';
var LOG_LOCATION_SUCCESS = 'g';
var LOG_LOCATION_ERROR = 'h';
var LOG_FETCH_WEATHER = 'i';
var LOG_OPENWEATHERMAP = 'j';
var LOG_YAHOO_WEATHER = 'k';
var LOG_FORECASTIO_WEATHER = 'l';
var LOG_FORECASTIO_NO_KEY = 'm';
var LOG_YRNO_WEATHER = 'n';
var LOG_WEATHER_SUCCESS = 'o';
var LOG_WEATHER_ERROR = 'p';
var LOG_FETCH_AQI = 'q';
var LOG_AQI_SUCCESS = 'r';
var LOG_AQI_ERROR = 's';
var LOG_NO_FETCH_AQI = 't';

var datalog = '';
var last_status_code = -1;
var last_location_error_code = -1;

function log(msg) {
    if (datalog.length > 100) {
        datalog = datalog.substring(10, datalog.length);
    }

    datalog += msg;

    window.localStorage.setItem('datalog', datalog);
}

function loadLog() {
    datalog = window.localStorage.getItem('datalog');
    if (!datalog) {
        datalog = '';
    }
}

function statusCode(code) {
    last_status_code = code;
}

function locationErrorCode(code) {
    last_location_error_code = code;
}
