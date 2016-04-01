#pragma once

#include <pebble.h>

#include "config.h"

#define MARGINTOP 4
#define STATUS_BAR_MARGINTOP 8
#define PWIDTH 144
#define HALFPWIDTH 72
#define PHEIGHT 168
#define STATUS_BAR_HEIGHT 16
#define STATUS_BAR_ITEM_WIDTH 46
#define STATUS_BAR_MARGIN 3
#define CHARGEUNIT 1.44

#define NO_ERROR 0
#define FETCH_ERROR 1
#define WEATHER_ERROR 2
#define LOCATION_ERROR 3
#define AQI_ERROR 4

#define MAX_RETRIES 10

struct State {
    int condition;
    int temperature;
    int air_quality_index;
    int is_day;
    int elapsed_time;
    int error;
    int retry_times;
};

struct Fonts {
    GFont date;
    GFont time;
    GFont month;
    GFont weather;
    GFont icons;
    GFont status_bar;
    GFont status_bar_weather;
    GFont status_bar_icons;
};

struct Layers {
    Layer *window;
    Layer *battery;
    TextLayer *date;
    TextLayer *time;
    TextLayer *month;
    TextLayer *temperature;
    TextLayer *condition;
    Layer *status_bar;
    TextLayer *status_bar1;
    TextLayer *status_bar2;
    TextLayer *status_bar3;
};

struct Texts {
    char date[20];
    char time[6];
    bool time_zero;
    char month[20];
    char temperature[6];
    char aqi[6];
    char condition[5];
    char am_pm[3];
    char battery_percent[6];
    char bluetooth[5];
};

struct UI {
    Window        *window;
    struct Layers layers;
    struct Texts  texts;
    struct Fonts  fonts;
    struct State  state;
};

void ui_align();
void ui_status_bar_item(TextLayer *layer, int item);
void ui_status_bar();
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
