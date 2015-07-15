#include <pebble.h>

#include "weather.h"

//IDs from http://openweathermap.org/weather-conditions
//Icons from http://erikflowers.github.io/weather-icons/
void weather_set_condition(int id, int is_day, char *condition_text) {
	int size = sizeof(condition_text);
	//strncpy(condition_text, " ", size);

	if (id >= 200 && id < 300) { //thunderstorm
		if (is_day == 1) {
			strncpy(condition_text, "\uf010", size);
		}
		else if (is_day == 0) {
			strncpy(condition_text, "\uf03b", size);
		}
		else {
			strncpy(condition_text, "\uf01e", size);
		}
	}
	else if (id >= 300 && id < 400) { //Drizzle
		if (is_day == 1) {
			strncpy(condition_text, "\uf00b", size);
		}
		else if (is_day == 0) {
			strncpy(condition_text, "\uf039", size);
		}
		else {
			strncpy(condition_text, "\uf01c", size);
		}
	}
	else if (id >= 500 && id < 600) { //Rain
		if (is_day == 1) {
			strncpy(condition_text, "\uf008", size);
		}
		else if (is_day == 0) {
			strncpy(condition_text, "\uf036", size);
		}
		else {
			strncpy(condition_text, "\uf019", size);
		}
	}
	else if (id >= 600 && id < 700) { //Snow
		if (is_day == 1) {
			strncpy(condition_text, "\uf00a", size);
		}
		else if (is_day == 0) {
			strncpy(condition_text, "\uf038", size);
		}
		else {
			strncpy(condition_text, "\uf01b", size);
		}
	}
	else if (id >= 700 && id < 800) { //Atmosphere (mist, fog, etc)
		if (is_day == 1) {
			strncpy(condition_text, "\uf003", size);
		}
		else if (is_day == 0) {
			strncpy(condition_text, "\uf04a", size);
		}
		else {
			strncpy(condition_text, "\uf014", size);
		}
	}
	else if (id == 800 || id == 951) { //Clear/Calm
		if (is_day == 0) {
			strncpy(condition_text, "\uf02e", size);
		}
		else {
			strncpy(condition_text, "\uf00d", size);
		}
	}
	else if (id > 800 && id < 900) { //Clouds
		if (is_day == 1) {
			strncpy(condition_text, "\uf002", size);
		}
		else if (is_day == 0) {
			strncpy(condition_text, "\uf031", size);
		}
		else {
			strncpy(condition_text, "\uf013", size);
		}
	}
	else if (id == 900) { //Tornado
		strncpy(condition_text, "\uf056", size);
	}
	else if (id == 901 || id == 902 || id == 962) { //Hurricane
		strncpy(condition_text, "\uf073", size);
	}
	else if (id == 903) { //Extreme cold
		strncpy(condition_text, "\uf076", size);
	}
	else if (id == 904) { //Extreme heat
		strncpy(condition_text, "\uf072", size);
	}
	else if (id == 906) { //Hail
		if (is_day == 1) {
			strncpy(condition_text, "\uf004", size);
		}
		else if (is_day == 0) {
			strncpy(condition_text, "\uf032", size);
		}
		else {
			strncpy(condition_text, "\uf015", size);
		}
	}
	else if (id >= 907 && id < 957) { //Wind
		strncpy(condition_text, "\uf021", size);
	}
	else if (id == 905 || (id >= 957 && id < 1000)) { //Extreme Wind
		strncpy(condition_text, "\uf050", size);
	}
	else { //Error or refreshing
		strncpy(condition_text, "\uf03e", size);
	}
}
