#include <pebble.h>

#include "weather.h"

//IDs from http://openweathermap.org/weather-conditions
//Icons from http://erikflowers.github.io/weather-icons/
void weather_set_condition(int code, int is_day, char *condition_text) {
    int size = sizeof(condition_text);

    //Error or refreshing
    strncpy(condition_text, "\uf03e", size); //wi-cloud-refresh

    if (code == CLEAR) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf00d", size); //wi-day-sunny
        }
        else {
            strncpy(condition_text, "\uf02e", size); //wi-night-clear
        }
    }
    else if (code == CLOUDY) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf002", size); //wi-day-cloudy
        }
        else {
            strncpy(condition_text, "\uf031", size); //wi-night-cloudy
        }
    }
    else if (code == FOG) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf003", size); //wi-day-fog
        }
        else {
            strncpy(condition_text, "\uf04a", size); //wi-night-fog
        }
    }
    else if (code == LIGHT_RAIN) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf00b", size); //wi-day-sprinkle
        }
        else {
            strncpy(condition_text, "\uf039", size); //wi-night-sprinkle
        }
    }
    else if (code == RAIN) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf008", size); //wi-day-rain
        }
        else {
            strncpy(condition_text, "\uf036", size); //wi-night-rain
        }
    }
    else if (code == THUNDERSTORM) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf010", size); //wi-day-thunderstorm
        }
        else {
            strncpy(condition_text, "\uf03b", size); //wi-night-thunderstorm
        }
    }
    else if (code == SNOW) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf00a", size); //wi-day-snow
        }
        else {
            strncpy(condition_text, "\uf038", size); //wi-night-snow
        }
    }
    else if (code == HAIL) {
        if (is_day == 1) {
            strncpy(condition_text, "\uf004", size); //wi-day-hail
        }
        else {
            strncpy(condition_text, "\uf032", size); //wi-night-hail
        }
    }
    else if (code == WIND) {
        strncpy(condition_text, "\uf021", size); //wi-windy
    }
    else if (code == EXTREME_WIND) {
        strncpy(condition_text, "\uf050", size); //wi-strong-wind
    }
    else if (code == TORNADO) {
        strncpy(condition_text, "\uf056", size); //wi-tornado
    }
    else if (code == HURRICANE) {
        strncpy(condition_text, "\uf073", size); //wi-hurricane
    }
    else if (code == EXTREME_COLD) {
        strncpy(condition_text, "\uf076", size); //wi-snowflake-cold
    }
    else if (code == EXTREME_HEAT) {
        strncpy(condition_text, "\uf072", size); //wi-hot
    }
}
