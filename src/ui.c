#include <pebble.h>

#include "ui.h"
#include "config.h"
#include "weather.h"
#include "helpers.h"

GColor get_color(int color) {
    #ifdef PBL_COLOR
        if (color == 1) {
            return GColorWhite;
        }
        else {
            return GColorFromHEX(color);
        }
    #else
        if (color == 0) {
            return GColorBlack;
        }
        else if (color == 2) {
            return GColorDarkGray;
        }
        else {
            return GColorWhite;
        }
    #endif
}

void ui_align() {
    int top = MARGINTOP;
    if (config.show_status_bar == 1) {
        top = STATUS_BAR_MARGINTOP;
    }

    if (config.layout == 1) {
        text_layer_move(ui.layers.time, 0, PHEIGHT - 64);
        layer_move(ui.layers.battery, 0, PHEIGHT - 90);
        text_layer_move(ui.layers.date, 0, PHEIGHT - 101);
        text_layer_move(ui.layers.month, 0, PHEIGHT - 122);
        text_layer_move(ui.layers.temperature, 0, PHEIGHT - 157);
        text_layer_move(ui.layers.condition, HALFPWIDTH + 1, PHEIGHT - 154);
    }
    else {
        text_layer_move(ui.layers.time, 0, top);
        layer_move(ui.layers.battery, 0, top + 29);
        text_layer_move(ui.layers.date, 0, top + 60);
        text_layer_move(ui.layers.month, 0, top + 96);
        text_layer_move(ui.layers.temperature, 0, top + 120);
        text_layer_move(ui.layers.condition, HALFPWIDTH + 1, top + 121);
    }
}

void ui_status_bar_item(TextLayer *layer, int item) {
    if (layer != NULL) {
        if (ui.fonts.status_bar == NULL && (
            item == STATUS_BAR_BATTERY_LEVEL ||
            item == STATUS_BAR_AQI ||
            item == STATUS_BAR_TEMP ||
            item == STATUS_BAR_AMPM
        )) {
            ui.fonts.status_bar = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_BOLD_14);
        }

        if (ui.fonts.status_bar_icons == NULL && item == STATUS_BAR_BLUETOOTH) {
            ui.fonts.status_bar_icons = fonts_load_resource_font(RESOURCE_ID_MATERIAL_14);
        }

        if (ui.fonts.status_bar_weather == NULL && item == STATUS_BAR_CONDITION) {
            ui.fonts.status_bar_weather = fonts_load_resource_font(RESOURCE_ID_WEATHER_14);
        }

        if (item == STATUS_BAR_BLUETOOTH) {
            bool connected = connection_service_peek_pebble_app_connection();

            if (connected) {
                strncpy(ui.texts.bluetooth, "\uf282", sizeof(ui.texts.bluetooth));
            }
            else {
                strncpy(ui.texts.bluetooth, "\uf27f", sizeof(ui.texts.bluetooth));
            }

            text_layer_show(layer);
            text_layer_set_font(layer, ui.fonts.status_bar_icons);
            text_layer_set_text(layer, ui.texts.bluetooth);
        }
        else if (item == STATUS_BAR_BATTERY_LEVEL) {
            text_layer_show(layer);
            text_layer_set_font(layer, ui.fonts.status_bar);
            text_layer_set_text(layer, ui.texts.battery_percent);
        }
        else if (item == STATUS_BAR_AQI) {
            text_layer_show(layer);
            text_layer_set_font(layer, ui.fonts.status_bar);
            text_layer_set_text(layer, ui.texts.aqi);
        }
        else if (item == STATUS_BAR_TEMP) {
            text_layer_show(layer);
            text_layer_set_font(layer, ui.fonts.status_bar);
            text_layer_set_text(layer, ui.texts.temperature);
        }
        else if (item == STATUS_BAR_CONDITION) {
            text_layer_show(layer);
            text_layer_set_font(layer, ui.fonts.status_bar_weather);
            text_layer_set_text(layer, ui.texts.condition);
        }
        else if (item == STATUS_BAR_AMPM) {
            text_layer_show(layer);
            text_layer_set_font(layer, ui.fonts.status_bar);
            text_layer_set_text(layer, ui.texts.am_pm);
        }
        else {
            text_layer_hide(layer);
        }
    }
}

void ui_status_bar() {
    if (config.show_status_bar == 1) {
        layer_show(ui.layers.status_bar);

        if (config.status_bar1 != STATUS_BAR_EMPTY) {
            if (ui.layers.status_bar1 == NULL) {
                ui.layers.status_bar1 = text_layer_init(
                    ui.layers.window,
                    GRect(STATUS_BAR_MARGIN, 0, STATUS_BAR_ITEM_WIDTH, STATUS_BAR_HEIGHT),
                    ui.fonts.time,
                    GColorClear,
                    get_color(config.status_bar_text_color),
                    GTextAlignmentLeft
                );
            }
        }

        if (config.status_bar2 != STATUS_BAR_EMPTY) {
            if (ui.layers.status_bar2 == NULL) {
                ui.layers.status_bar2 = text_layer_init(
                    ui.layers.window,
                    GRect(STATUS_BAR_MARGIN + STATUS_BAR_ITEM_WIDTH, 0, STATUS_BAR_ITEM_WIDTH, STATUS_BAR_HEIGHT),
                    ui.fonts.time,
                    GColorClear,
                    get_color(config.status_bar_text_color),
                    GTextAlignmentCenter
                );
            }
        }

        if (config.status_bar3 != STATUS_BAR_EMPTY) {
            if (ui.layers.status_bar3 == NULL) {
                ui.layers.status_bar3 = text_layer_init(
                    ui.layers.window,
                    GRect(STATUS_BAR_MARGIN + (STATUS_BAR_ITEM_WIDTH * 2), 0, STATUS_BAR_ITEM_WIDTH, STATUS_BAR_HEIGHT),
                    ui.fonts.time,
                    GColorClear,
                    get_color(config.status_bar_text_color),
                    GTextAlignmentRight
                );
            }
        }

        ui_status_bar_item(ui.layers.status_bar1, config.status_bar1);
        ui_status_bar_item(ui.layers.status_bar2, config.status_bar2);
        ui_status_bar_item(ui.layers.status_bar3, config.status_bar3);
    }
    else {
        layer_hide(ui.layers.status_bar);
    }
}

void ui_colorize() {
    GColor text_color;
    GColor background_color;
    if (ui.state.is_day) {
        text_color = get_color(config.day_text_color);
        background_color = get_color(config.day_background_color);
    }
    else {
        text_color = get_color(config.night_text_color);
        background_color = get_color(config.night_background_color);
    }

    window_set_background_color(ui.window, background_color);
    text_layer_set_text_color(ui.layers.time, text_color);
    layer_mark_dirty(ui.layers.battery);
    layer_mark_dirty(ui.layers.status_bar);
    text_layer_set_text_color(ui.layers.date, text_color);
    text_layer_set_text_color(ui.layers.month, text_color);
    text_layer_set_text_color(ui.layers.temperature, text_color);
    text_layer_set_text_color(ui.layers.condition, text_color);

    GColor status_bar_text_color = get_color(config.status_bar_text_color);
    if (ui.layers.status_bar1 != NULL) {
        text_layer_set_text_color(ui.layers.status_bar1, status_bar_text_color);
    }

    if (ui.layers.status_bar2 != NULL) {
        text_layer_set_text_color(ui.layers.status_bar2, status_bar_text_color);
    }

    if (ui.layers.status_bar3 != NULL) {
        text_layer_set_text_color(ui.layers.status_bar3, status_bar_text_color);
    }
}

void ui_weather_update() {
    if (ui.state.error == AQI_ERROR || ui.state.error == FETCH_ERROR || ui.state.air_quality_index == -999) {
        strncpy(ui.texts.aqi, "", sizeof(ui.texts.aqi));
    }
    else {
        snprintf(ui.texts.aqi, sizeof(ui.texts.aqi), "%d", ui.state.air_quality_index);
    }

    if (ui.state.error == WEATHER_ERROR || ui.state.error == FETCH_ERROR || ui.state.temperature == -999) {
        strncpy(ui.texts.temperature, "", sizeof(ui.texts.temperature));
    }
    else {
        snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d\u00b0", ui.state.temperature);
    }

    if (ui.fonts.icons == NULL && (
        ui.state.error == WEATHER_ERROR ||
        ui.state.error == LOCATION_ERROR ||
        ui.state.error == AQI_ERROR
    )) {
        ui.fonts.icons = fonts_load_resource_font(RESOURCE_ID_MATERIAL_30);
    }

    //TODO show something when bluetooth disconnected & trying to fetch

    if (ui.state.error == FETCH_ERROR) {
        text_layer_set_font(ui.layers.condition, ui.fonts.weather);
        strncpy(ui.texts.condition, "\uf03e", sizeof(ui.texts.condition));
    }
    else if (ui.state.error == WEATHER_ERROR) {
        text_layer_set_font(ui.layers.condition, ui.fonts.icons);
        strncpy(ui.texts.condition, "\uf21b", sizeof(ui.texts.condition));
    }
    else if (ui.state.error == LOCATION_ERROR) {
        text_layer_set_font(ui.layers.condition, ui.fonts.icons);
        strncpy(ui.texts.condition, "\uf1aa", sizeof(ui.texts.condition));
    }
    else if (ui.state.error == AQI_ERROR) {
        text_layer_set_font(ui.layers.condition, ui.fonts.icons);
        strncpy(ui.texts.condition, "\uf368", sizeof(ui.texts.condition));
    }
    else {
        text_layer_set_font(ui.layers.condition, ui.fonts.weather);
        weather_set_condition(ui.state.condition, ui.state.is_day, ui.texts.condition);
    }

    //For pretty screenshots
    //strncpy(ui.texts.temperature, "75\u00b0", sizeof(ui.texts.temperature));
    //strncpy(ui.texts.condition, "\uf00d", sizeof(ui.texts.condition));

    if (config.air_quality) {
        text_layer_set_text(ui.layers.temperature, ui.texts.aqi);
    }
    else {
        text_layer_set_text(ui.layers.temperature, ui.texts.temperature);
    }

    text_layer_set_text(ui.layers.condition, ui.texts.condition);
}

void ui_battery_update() {
    BatteryChargeState battery = battery_state_service_peek();
    snprintf(ui.texts.battery_percent, sizeof(ui.texts.battery_percent), "%d%%", battery.charge_percent);

    if (config.hide_battery == 1) {
        layer_hide(ui.layers.battery);
    }
    else {
        layer_show(ui.layers.battery);
        layer_mark_dirty(ui.layers.battery);
    }

    ui_status_bar();
}

void ui_battery_dirty(Layer *layer, GContext *ctx) {
    BatteryChargeState battery = battery_state_service_peek();
    int width = battery.charge_percent * CHARGEUNIT;

    //For pretty screenshots
    //width = 70 * CHARGEUNIT;

    int offset = (PWIDTH - width) / 2;
    GColor text_color;

    if (ui.state.is_day) {
        text_color = get_color(config.day_text_color);
    }
    else {
        text_color = get_color(config.night_text_color);
    }

    graphics_context_set_fill_color(ctx, text_color);
    graphics_fill_rect(ctx, GRect(offset, 29, width, 4), 0, GCornerNone);
}

void ui_status_bar_dirty(Layer *layer, GContext *ctx) {
    graphics_context_set_fill_color(ctx, get_color(config.status_bar_color));
    graphics_fill_rect(ctx, layer_get_frame(layer), 0, GCornerNone);
}

void ui_time_update() {
    //For pretty screenshots
    //strncpy(ui.texts.time, "12:00", sizeof(ui.texts.time));
    //strncpy(ui.texts.date, "Csüt 28", sizeof(ui.texts.date));
    //strncpy(ui.texts.month, "Május", sizeof(ui.texts.month));

    text_layer_set_text(ui.layers.time, ui.texts.time);
    text_layer_set_text(ui.layers.date, ui.texts.date);
    text_layer_set_text(ui.layers.month, ui.texts.month);

    //Update day/night flag
    if (config.sunrise > 0 && config.sunset > 0) {
        time_t now = time(NULL);
        struct tm *time_tick = localtime(&now);
        int minutes = time_tick->tm_hour * 60 + time_tick->tm_min;

        if (config.sunrise <= minutes && minutes < config.sunset) {
            ui.state.is_day = 1;
        }
        else {
            ui.state.is_day = 0;
        }
    }
    else {
        ui.state.is_day = -1;
    }
}

void ui_window_load(Window *window) {
    ui.layers.window = window_get_root_layer(window);

    ui.layers.time = text_layer_init(
        ui.layers.window,
        GRect(0, MARGINTOP, PWIDTH, 100),
        ui.fonts.time,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.battery = layer_init(ui.layers.window, GRect(0, MARGINTOP + 29, PWIDTH, 100), ui_battery_dirty);

    ui.layers.date = text_layer_init(
        ui.layers.window,
        GRect(0, MARGINTOP + 60, PWIDTH, 100),
        ui.fonts.date,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.month = text_layer_init(
        ui.layers.window,
        GRect(0, MARGINTOP + 96, PWIDTH, 28),
        ui.fonts.month,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.temperature = text_layer_init(
        ui.layers.window,
        GRect(0, MARGINTOP + 120, HALFPWIDTH, 50),
        ui.fonts.date,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.condition = text_layer_init(
        ui.layers.window,
        GRect(HALFPWIDTH + 1, MARGINTOP + 121, HALFPWIDTH, 50),
        ui.fonts.weather,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.status_bar = layer_init(ui.layers.window, GRect(0, 0, PWIDTH, STATUS_BAR_HEIGHT), ui_status_bar_dirty);

    ui_align();
    ui_status_bar();
}

void ui_window_unload(Window *window) {
    text_layer_destroy_safe(ui.layers.time);
    layer_destroy_safe(ui.layers.battery);
    text_layer_destroy_safe(ui.layers.date);
    text_layer_destroy_safe(ui.layers.month);
    text_layer_destroy_safe(ui.layers.temperature);
    text_layer_destroy_safe(ui.layers.condition);
    layer_destroy_safe(ui.layers.status_bar);

    text_layer_destroy_safe(ui.layers.status_bar1);
    text_layer_destroy_safe(ui.layers.status_bar2);
    text_layer_destroy_safe(ui.layers.status_bar3);
}

void ui_init() {
    struct Fonts fonts;
    fonts.time = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_BOLD_50);
    fonts.date = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_32);
    fonts.month = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_MONO_20);
    fonts.weather = fonts_load_resource_font(RESOURCE_ID_WEATHER_30);
    fonts.icons = NULL;
    fonts.status_bar = NULL;
    fonts.status_bar_weather = NULL;
    fonts.status_bar_icons = NULL; //TODO reduce regex

    struct Texts texts;
    struct Layers layers;
    struct State state;
    ui.layers = layers;
    ui.texts = texts;
    ui.fonts = fonts;
    ui.state = state;

    ui.layers.status_bar1 = NULL;
    ui.layers.status_bar2 = NULL;
    ui.layers.status_bar3 = NULL;

    ui.window = window_create();
    window_set_window_handlers(ui.window, (WindowHandlers) {
        .load = ui_window_load,
        .unload = ui_window_unload,
    });

    const bool animated = true;
    window_stack_push(ui.window, animated);

    ui.state.condition = -999;
    ui.state.temperature = -999;
    ui.state.air_quality_index = -999;
    ui.state.is_day = 1;
    ui.state.elapsed_time = 0;
    ui.state.error = FETCH_ERROR;
    ui.state.retry_times = MAX_RETRIES;
    ui.texts.time_zero = false;
    strncpy(ui.texts.temperature, "", sizeof(ui.texts.temperature));
}

void ui_deinit() {
    window_destroy(ui.window);

    fonts_unload_custom_font_safe(ui.fonts.time);
    fonts_unload_custom_font_safe(ui.fonts.date);
    fonts_unload_custom_font_safe(ui.fonts.month);
    fonts_unload_custom_font_safe(ui.fonts.weather);
    fonts_unload_custom_font_safe(ui.fonts.icons);
    fonts_unload_custom_font_safe(ui.fonts.status_bar);
    fonts_unload_custom_font_safe(ui.fonts.status_bar_weather);
    fonts_unload_custom_font_safe(ui.fonts.status_bar_icons);
}
