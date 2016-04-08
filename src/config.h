#pragma once

#define STATUS_BAR_EMPTY 0
#define STATUS_BAR_BLUETOOTH 1
#define STATUS_BAR_BATTERY_LEVEL 2
#define STATUS_BAR_AQI 3
#define STATUS_BAR_TEMP 4
#define STATUS_BAR_CONDITION 5
#define STATUS_BAR_AMPM 6
#define STATUS_BAR_STEPS_SHORT 7
#define STATUS_BAR_STEPS 8
#define STATUS_BAR_DISTANCE 9
#define STATUS_BAR_CAL 10

struct Config {
    int sunrise;
    int sunset;
    int refresh_time;
    int wait_time;
    int hide_battery;
    int vibrate_bluetooth;
    int day_text_color;
    int day_background_color;
    int night_text_color;
    int night_background_color;
    int language;
    int layout;
    int air_quality;
    int hourly_vibrate;
    int show_status_bar;
    int status_bar_color;
    int status_bar_text_color;
    int status_bar1;
    int status_bar2;
    int status_bar3;
};

void load_config();
void save_config();

struct Config config;
