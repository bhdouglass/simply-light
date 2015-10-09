#pragma once

struct Config {
    int sunrise;
    int sunset;
    int refresh_time;
    int wait_time;
    int show_am_pm;
    int hide_battery;
    int vibrate_bluetooth;
    int charging_icon;
    int bt_disconnect_icon;
    int battery_percent;
    int day_text_color;
    int day_background_color;
    int night_text_color;
    int night_background_color;
    int language;
    int layout;
    int air_quality;
    int aqi_degree;
    int hourly_vibrate;
};

void load_config();
void save_config();

struct Config config;
