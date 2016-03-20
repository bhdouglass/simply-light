var LOG_FETCH = '0';
var LOG_FETCH_WEATHER = '1';
var LOG_LOCATION_ERROR = '2';
var LOG_WEATHER_CALLBACK = '3';
var LOG_AIRQUALITY_CALLBACK = '4';
var LOG_LOCATION_CALLBACK = '5';
var LOG_OPENWEATHERMAP = '6';
var LOG_WEATHER_SUCCESS = '7';
var LOG_WEATHER_ERROR = '8';
var LOG_YRNOWEATHER = '9';
var LOG_YRNO_SUNRISE = 'A';
var LOG_YRNO_SUNRISE_SUCCESS = 'B';
var LOG_YRNO_SUNRISE_ERROR = 'C';
var LOG_FORECASTIOWEATHER = 'D';
var LOG_FORECASTIO_NO_KEY = 'E';
var LOG_FETCH_AIRQUALITY = 'F';
var LOG_AQI_MISSING_INDEX = 'G';
var LOG_AQI_SUCCESS = 'H';
var LOG_AQI_MISSING_LOCATIONS = 'I';
var LOG_AQI_MISSING_RESPONSE = 'J';
var LOG_AQI_ERROR = 'K';
var LOG_GET_ERROR = 'L';
var LOG_FETCH_LOCATION = 'M';
var LOG_LOCATION_SUCCESS = 'N';
var LOG_LOCATION_ERROR = 'O';
var LOG_YAHOOWEATHER = 'P';
var LOG_FETCH_WEATHER2 = 'Q';

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
