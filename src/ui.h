#pragma once

#include <pebble.h>

#include "config.h"

#define MARGINTOP 5
#define PWIDTH 144
#define HALFPWIDTH 72
#define PHEIGHT 168
#define CHARGEUNIT 1.44

#define NO_ERROR 0
#define FETCH_ERROR 1
#define WEATHER_ERROR 2
#define LOCATION_ERROR 3
#define AQI_ERROR 4

struct State {
    BatteryChargeState battery;
    bool               bt_connected;
    int                condition;
    int                temperature;
    int                air_quality_index;
    int                is_day;
    int                elapsed_time;
    int                error;
};

struct Fonts {
    GFont date;
    GFont time;
    GFont month;
    GFont weather;
    GFont air_quality_index;
    GFont am_pm;
    GFont icons;
    GFont battery;
};

struct Layers {
    Layer *window;
    Layer *battery;
    TextLayer *date;
    TextLayer *time;
    TextLayer *month;
    TextLayer *temperature;
    TextLayer *air_quality_index;
    TextLayer *condition;
    TextLayer *am_pm;
    TextLayer *battery_percent;
};

struct Texts {
    char date[20];
    char time[6];
    bool time_zero;
    char month[20];
    char temperature[6];
    char air_quality_index[6];
    char condition[5];
    char am_pm[3];
    char battery_percent[6];
};

struct UI {
    Window        *window;
    struct Layers layers;
    struct Texts  texts;
    struct Fonts  fonts;
    struct State  state;
};

void ui_align();
void ui_colorize();
void ui_weather_update();
void ui_battery_update();
void ui_battery_dirty(Layer *layer, GContext *ctx);
void ui_time_update();
void ui_window_load(Window *window);
void ui_window_unload(Window *window);
void ui_init();
void ui_deinit();

struct UI ui;
