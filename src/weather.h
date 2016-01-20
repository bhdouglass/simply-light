#pragma once

#define CLEAR 0
#define CLOUDY 1
#define FOG 2
#define LIGHT_RAIN 3
#define RAIN 4
#define THUNDERSTORM 5
#define SNOW 6
#define HAIL 7
#define WIND 8
#define EXTREME_WIND 9
#define TORNADO 10
#define HURRICANE 11
#define EXTREME_COLD 12
#define EXTREME_HEAT 13
#define SNOW_THUNDERSTORM 14

void weather_set_condition(int code, int is_day, char *condition_text);
