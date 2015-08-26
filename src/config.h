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
    GColor day_text_color;
    GColor day_background_color;
    GColor night_text_color;
    GColor night_background_color;
    GColor text_color;
    GColor background_color;
    int language;
};

GColor load_color(int color);
void load_config();
void save_config();

struct Config config;
