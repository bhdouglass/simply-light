#pragma once

#include <pebble.h>

#if PBL_PLATFORM_EMERY
    #define MARGINTOP 10
    #define MARGINTOP_WITH_STATUS_BAR 14
    #define STATUS_BAR_MARGINTOP 0
    #define STATUS_BAR_HEIGHT 16
    #define INFO_MARGIN 0
#else
    #if PBL_ROUND
        #define MARGINTOP 12
        #define MARGINTOP_WITH_STATUS_BAR 12
        #define STATUS_BAR_MARGINTOP 4
        #define STATUS_BAR_HEIGHT 20
        #define INFO_MARGIN 20
    #else
        #define MARGINTOP 4
        #define MARGINTOP_WITH_STATUS_BAR 8
        #define STATUS_BAR_MARGINTOP 0
        #define STATUS_BAR_HEIGHT 16
        #define INFO_MARGIN 0
    #endif
#endif

#define STATUS_BAR_MARGIN 3

struct Fonts {
    GFont time_text;
    GFont info_text;
    GFont status_text;
    GFont month_text;
    GFont info_icons;
    GFont status_icons;
};

struct Texts {
    char date[10];
    char time[6];
    char month[20];
    char temperature[6];
    char aqi[4];
    char condition[4];
    char ampm[4];
    char battery_percent[5];
    char battery_icon[4];
    char bluetooth[4];
    char steps_short[6];
    char steps[8];
    char distance[8];
    char calories[6];
    char sleep_time[6];
    char restful_sleep_time[6];
};

struct Layers {
    Layer *window;
    Layer *battery;
    TextLayer *date;
    TextLayer *time;
    TextLayer *month;
    TextLayer *info_box_left;
    TextLayer *info_box_right;
    TextLayer *status_bar;
    TextLayer *status_bar1;
    TextLayer *status_bar2;
    TextLayer *status_bar3;
};

struct UI {
    Window *window;
    struct Layers layers;
    struct Fonts fonts;
    struct Texts texts;
};

void ui_set_datetime(struct tm *tick_time, TimeUnits units_changed);
void ui_set_temperature(int temp, int error);
void ui_set_condition(int condition, int error);
void ui_set_aqi(int aqi, int error);
void ui_set_bluetooth(bool connected);
void ui_set_battery_level(int level);
void ui_set_steps(int steps);
void ui_set_walk_distance(float distance, MeasurementSystem sys);
void ui_set_calories(int calories);
void ui_set_sleeping(bool sleeping, int sleep_time, int restful_sleep_time);
void ui_set_unobstructed_area(GRect unobstructed_area);

void ui_refresh_info();
void ui_layout();
void ui_colorize();

void ui_init();
void ui_deinit();

struct UI ui;
