#include <pebble.h>

#include "weather.h"

//IDs from http://openweathermap.org/weather-conditions
//Icons from http://erikflowers.github.io/weather-icons/
void weather_set_condition(int id, int is_day, char *condition_text) {
    int size = sizeof(condition_text);

    //Error or refreshing
    strncpy(condition_text, "\uf03e", size); //wi-cloud-refresh

    if (id >= 200 && id < 300) { //thunderstorm
        if (is_day == 1) {
            strncpy(condition_text, "\uf010", size); //wi-day-thunderstorm
        }
        else {
            strncpy(condition_text, "\uf03b", size); //wi-night-thunderstorm
        }
    }
    else if (id >= 300 && id < 400) { //Drizzle
        if (is_day == 1) {
            strncpy(condition_text, "\uf00b", size); //wi-day-sprinkle
        }
        else {
            strncpy(condition_text, "\uf039", size); //wi-night-sprinkle
        }
    }
    else if (id >= 500 && id < 600) { //Rain
        if (is_day == 1) {
            strncpy(condition_text, "\uf008", size); //wi-day-rain
        }
        else {
            strncpy(condition_text, "\uf036", size); //wi-night-rain
        }
    }
    else if (id >= 600 && id < 700) { //Snow
        if (is_day == 1) {
            strncpy(condition_text, "\uf00a", size); //wi-day-snow
        }
        else {
            strncpy(condition_text, "\uf038", size); //wi-night-snow
        }
    }
    else if (id >= 700 && id < 800) { //Atmosphere (mist, fog, etc)
        if (is_day == 1) {
            strncpy(condition_text, "\uf003", size); //wi-day-fog
        }
        else {
            strncpy(condition_text, "\uf04a", size); //wi-night-fog
        }
    }
    else if (id == 800 || id == 951) { //Clear/Calm
        if (is_day == 1) {
            strncpy(condition_text, "\uf00d", size); //wi-day-sunny
        }
        else {
            strncpy(condition_text, "\uf02e", size); //wi-night-clear
        }
    }
    else if (id > 800 && id < 900) { //Clouds
        if (is_day == 1) {
            strncpy(condition_text, "\uf002", size); //wi-day-cloudy
        }
        else {
            strncpy(condition_text, "\uf031", size); //wi-night-cloudy
        }
    }
    else if (id == 900) { //Tornado
        strncpy(condition_text, "\uf056", size); //wi-tornado
    }
    else if (id == 901 || id == 902 || id == 962) { //Hurricane
        strncpy(condition_text, "\uf073", size); //wi-hurricane
    }
    else if (id == 903) { //Extreme cold
        strncpy(condition_text, "\uf076", size); //wi-snowflake-cold
    }
    else if (id == 904) { //Extreme heat
        strncpy(condition_text, "\uf072", size); //wi-hot
    }
    else if (id == 906) { //Hail
        if (is_day == 1) {
            strncpy(condition_text, "\uf004", size); //wi-day-hail
        }
        else {
            strncpy(condition_text, "\uf032", size); //wi-night-hail
        }
    }
    else if (id >= 907 && id < 957) { //Wind
        strncpy(condition_text, "\uf021", size); //wi-windy
    }
    else if (id == 905 || (id >= 957 && id < 1000)) { //Extreme Wind
        strncpy(condition_text, "\uf050", size); //wi-strong-wind
    }
}
