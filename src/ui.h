#pragma once

#include <pebble.h>

#include "config.h"

#define MARGINTOP 5
#define PWIDTH 144
#define HALFPWIDTH 72
#define PHEIGHT 168
#define CHARGEUNIT 1.44

struct State {
    BatteryChargeState battery;
    bool               bt_connected;
    int                condition;
    int                is_day;
    int                elapsed_time;
    bool               request_failed;
};

struct Fonts {
    GFont date;
    GFont time;
    GFont month;
    GFont weather;
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
    TextLayer *condition;
    TextLayer *am_pm;
    TextLayer *battery_percent;
};

struct Texts {
    char date[7];
    char time[6];
    bool time_zero;
    char month[10];
    char temperature[6];
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
