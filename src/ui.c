#include <pebble.h>

#include "ui.h"
#include "config.h"
#include "weather.h"

void ui_align() {
    if (config.layout == 1) {
        layer_set_frame((Layer *) ui.layers.time, GRect(0, PHEIGHT - 64, PWIDTH, 100));
        layer_set_frame((Layer *) ui.layers.battery, GRect(0, PHEIGHT - 90, PWIDTH, 100));
        layer_set_frame((Layer *) ui.layers.date, GRect(0, PHEIGHT - 101, PWIDTH, 100));
        layer_set_frame((Layer *) ui.layers.month, GRect(0, PHEIGHT - 122, PWIDTH, 28));
        layer_set_frame((Layer *) ui.layers.temperature, GRect(0, PHEIGHT - 157, HALFPWIDTH, 50));
        layer_set_frame((Layer *) ui.layers.condition, GRect(HALFPWIDTH + 1, PHEIGHT - 154, HALFPWIDTH, 50));
        //am_pm layer set in ui_time_update()
        layer_set_frame((Layer *) ui.layers.battery_percent, GRect(3, MARGINTOP - 7, PWIDTH - 5, 20));
        //air_quality_index layer set in ui_weather_update()
    }
    else {
        int top = MARGINTOP;
        if (config.battery_percent != 0) {
            top = top + 3;
        }

        APP_LOG(APP_LOG_LEVEL_DEBUG, "%d", top);

        layer_set_frame((Layer *) ui.layers.time, GRect(0, top, PWIDTH, 100));
        layer_set_frame((Layer *) ui.layers.battery, GRect(0, top + 29, PWIDTH, 100));
        layer_set_frame((Layer *) ui.layers.date, GRect(0, top + 60, PWIDTH, 100));
        layer_set_frame((Layer *) ui.layers.month, GRect(0, top + 96, PWIDTH, 28));
        layer_set_frame((Layer *) ui.layers.temperature, GRect(0, top + 120, HALFPWIDTH, 50));
        layer_set_frame((Layer *) ui.layers.condition, GRect(HALFPWIDTH + 1, top + 121, HALFPWIDTH, 50));
        //am_pm layer set in ui_time_update()
        layer_set_frame((Layer *) ui.layers.battery_percent, GRect(3, MARGINTOP - 7, PWIDTH - 5, 20));
        //air_quality_index layer set in ui_weather_update()
    }
}

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
    text_layer_set_text_color(ui.layers.date, text_color);
    text_layer_set_text_color(ui.layers.month, text_color);
    text_layer_set_text_color(ui.layers.temperature, text_color);
    text_layer_set_text_color(ui.layers.condition, text_color);
    text_layer_set_text_color(ui.layers.am_pm, text_color);
    text_layer_set_text_color(ui.layers.battery_percent, text_color);
    text_layer_set_text_color(ui.layers.air_quality_index, text_color);
}

void ui_weather_update() {
    if (config.aqi_degree == 1 && config.air_quality == 1) {
        layer_set_hidden((Layer *) ui.layers.air_quality_index, false);

        if (ui.state.error == WEATHER_ERROR || ui.state.error == FETCH_ERROR || ui.state.temperature == -999) {
            strncpy(ui.texts.temperature, "", sizeof(ui.texts.temperature));
        }
        else {
            snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d ", ui.state.temperature);
        }

        if (ui.state.error != NO_ERROR || ui.state.air_quality_index == -999) {
            strncpy(ui.texts.air_quality_index, "", sizeof(ui.texts.air_quality_index));
        }
        else {
            snprintf(ui.texts.air_quality_index, sizeof(ui.texts.air_quality_index), "%d", ui.state.air_quality_index);
        }

        if (config.layout == 1) {
            if (strlen(ui.texts.temperature) == 2) {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(16, PHEIGHT - 157, HALFPWIDTH, 50));
            }
            else if (strlen(ui.texts.temperature) == 3) {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(26, PHEIGHT - 157, HALFPWIDTH, 50));
            }
            else if (strlen(ui.texts.temperature) == 4) {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(35, PHEIGHT - 157, HALFPWIDTH, 50));
            }
            else {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(38, PHEIGHT - 157, HALFPWIDTH, 50));
            }
        }
        else {
            int top = MARGINTOP;
            if (config.battery_percent != 0) {
                top = top + 3;
            }

            if (strlen(ui.texts.temperature) == 2) {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(16, top + 120, HALFPWIDTH, 50));
            }
            else if (strlen(ui.texts.temperature) == 3) {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(26, top + 120, HALFPWIDTH, 50));
            }
            else if (strlen(ui.texts.temperature) == 4) {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(35, top + 120, HALFPWIDTH, 50));
            }
            else {
                layer_set_frame((Layer *) ui.layers.air_quality_index, GRect(38, top + 120, HALFPWIDTH, 50));
            }
        }
    }
    else {
        layer_set_hidden((Layer *) ui.layers.air_quality_index, true);
        strncpy(ui.texts.air_quality_index, "", sizeof(ui.texts.air_quality_index));

        if (config.air_quality == 1) {
            if (ui.state.error == AQI_ERROR || ui.state.error == FETCH_ERROR || ui.state.air_quality_index == -999) {
                strncpy(ui.texts.temperature, "", sizeof(ui.texts.temperature));
            }
            else {
                snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d", ui.state.air_quality_index);
            }
        }
        else {
            if (ui.state.error == WEATHER_ERROR || ui.state.error == FETCH_ERROR || ui.state.temperature == -999) {
                strncpy(ui.texts.temperature, "", sizeof(ui.texts.temperature));
            }
            else {
                snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d\u00b0", ui.state.temperature);
            }
        }
    }

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

    if (ui.state.battery.is_charging && config.charging_icon) {
        text_layer_set_font(ui.layers.condition, ui.fonts.icons);
        strncpy(ui.texts.condition, "\uf114", sizeof(ui.texts.condition));
    }
    else if (!ui.state.bt_connected && config.bt_disconnect_icon) {
        text_layer_set_font(ui.layers.condition, ui.fonts.icons);
        strncpy(ui.texts.condition, "\uf27f", sizeof(ui.texts.condition));
    }

    //For pretty screenshots
    //strncpy(ui.texts.temperature, "75\u00b0", sizeof(ui.texts.temperature));
    //strncpy(ui.texts.condition, "\uf00d", sizeof(ui.texts.condition));

    text_layer_set_text(ui.layers.air_quality_index, ui.texts.air_quality_index);
    text_layer_set_text(ui.layers.temperature, ui.texts.temperature);
    text_layer_set_text(ui.layers.condition, ui.texts.condition);
}

void ui_battery_update() {
    layer_mark_dirty(ui.layers.battery);
    layer_mark_dirty((Layer *) ui.layers.battery_percent);

    text_layer_set_text(ui.layers.battery_percent, ui.texts.battery_percent);
    if (config.battery_percent == 0) {
        layer_set_hidden((Layer *) ui.layers.battery_percent, true);
    }
    else if (config.battery_percent == 1) {
        layer_set_hidden((Layer *) ui.layers.battery_percent, false);
        text_layer_set_text_alignment(ui.layers.battery_percent, GTextAlignmentRight);
    }
    else {
        layer_set_hidden((Layer *) ui.layers.battery_percent, false);
        text_layer_set_text_alignment(ui.layers.battery_percent, GTextAlignmentLeft);
    }

    if (config.hide_battery == 1) {
        layer_set_hidden((Layer *) ui.layers.battery, true);
    }
    else {
        layer_set_hidden((Layer *) ui.layers.battery, false);
    }
}

void ui_battery_dirty(Layer *layer, GContext *ctx) {
    int width = ui.state.battery.charge_percent * CHARGEUNIT;

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

void ui_time_update() {
    //For pretty screenshots
    //strncpy(ui.texts.time, "12:00", sizeof(ui.texts.time));
    //strncpy(ui.texts.date, "Csüt 28", sizeof(ui.texts.date));
    //strncpy(ui.texts.month, "Május", sizeof(ui.texts.month));

    text_layer_set_text(ui.layers.time, ui.texts.time);
    text_layer_set_text(ui.layers.date, ui.texts.date);
    text_layer_set_text(ui.layers.month, ui.texts.month);
    text_layer_set_text(ui.layers.am_pm, ui.texts.am_pm);

    //Update am/pm
    if (config.show_am_pm == 1 && !clock_is_24h_style()) {
        layer_set_hidden((Layer *) ui.layers.am_pm, false);

        if (config.layout == 1) {
            layer_set_frame((Layer *) ui.layers.am_pm, GRect(0, MARGINTOP - 5, PWIDTH, 20));
        }
        else {
            int top = MARGINTOP;
            if (config.battery_percent != 0) {
                top = top + 3;
            }

            if (ui.texts.time_zero) {
                layer_set_frame((Layer *) ui.layers.am_pm, GRect(-13, top, PWIDTH, 20));
            }
            else {
                layer_set_frame((Layer *) ui.layers.am_pm, GRect(0, top, PWIDTH, 20));
            }
        }
    }
    else {
        layer_set_hidden((Layer *) ui.layers.am_pm, true);
    }

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

    ui.layers.time = text_layer_create(GRect(0, MARGINTOP, PWIDTH, 100));
    text_layer_set_background_color(ui.layers.time, GColorClear);
    text_layer_set_font(ui.layers.time, ui.fonts.time);
    text_layer_set_text_alignment(ui.layers.time, GTextAlignmentCenter);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.time));

    ui.layers.battery = layer_create(GRect(0, MARGINTOP + 29, PWIDTH, 100));
    layer_set_update_proc(ui.layers.battery, ui_battery_dirty);
    layer_add_child(ui.layers.window, ui.layers.battery);

    ui.layers.date = text_layer_create(GRect(0, MARGINTOP + 60, PWIDTH, 100));
    text_layer_set_background_color(ui.layers.date, GColorClear);
    text_layer_set_font(ui.layers.date, ui.fonts.date);
    text_layer_set_text_alignment(ui.layers.date, GTextAlignmentCenter);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.date));

    ui.layers.month = text_layer_create(GRect(0, MARGINTOP + 96, PWIDTH, 28));
    text_layer_set_background_color(ui.layers.month, GColorClear);
    text_layer_set_font(ui.layers.month, ui.fonts.month);
    text_layer_set_text_alignment(ui.layers.month, GTextAlignmentCenter);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.month));

    ui.layers.temperature = text_layer_create(GRect(0, MARGINTOP + 120, HALFPWIDTH, 50));
    text_layer_set_background_color(ui.layers.temperature, GColorClear);
    text_layer_set_font(ui.layers.temperature, ui.fonts.date);
    text_layer_set_text_alignment(ui.layers.temperature, GTextAlignmentCenter);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.temperature));

    ui.layers.air_quality_index = text_layer_create(GRect(0, MARGINTOP + 120, HALFPWIDTH, 50));
    text_layer_set_background_color(ui.layers.air_quality_index, GColorClear);
    text_layer_set_font(ui.layers.air_quality_index, ui.fonts.air_quality_index);
    text_layer_set_text_alignment(ui.layers.air_quality_index, GTextAlignmentCenter);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.air_quality_index));

    ui.layers.condition = text_layer_create(GRect(HALFPWIDTH + 1, MARGINTOP + 121, HALFPWIDTH, 50));
    text_layer_set_background_color(ui.layers.condition, GColorClear);
    text_layer_set_font(ui.layers.condition, ui.fonts.weather);
    text_layer_set_text_alignment(ui.layers.condition, GTextAlignmentCenter);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.condition));

    ui.layers.am_pm = text_layer_create(GRect(0, MARGINTOP, PWIDTH, 20));
    text_layer_set_background_color(ui.layers.am_pm, GColorClear);
    text_layer_set_font(ui.layers.am_pm, ui.fonts.am_pm);
    text_layer_set_text_alignment(ui.layers.am_pm, GTextAlignmentCenter);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.am_pm));

    ui.layers.battery_percent = text_layer_create(GRect(3, MARGINTOP - 5, PWIDTH - 5, 20));
    text_layer_set_background_color(ui.layers.battery_percent, GColorClear);
    text_layer_set_font(ui.layers.battery_percent, ui.fonts.battery);
    text_layer_set_text_alignment(ui.layers.battery_percent, GTextAlignmentRight);
    layer_add_child(ui.layers.window, text_layer_get_layer(ui.layers.battery_percent));

    ui_align();
}

void ui_window_unload(Window *window) {
    text_layer_destroy(ui.layers.time);
    layer_destroy(ui.layers.battery);
    text_layer_destroy(ui.layers.date);
    text_layer_destroy(ui.layers.month);
    text_layer_destroy(ui.layers.temperature);
    text_layer_destroy(ui.layers.air_quality_index);
    text_layer_destroy(ui.layers.condition);
    text_layer_destroy(ui.layers.am_pm);
    text_layer_destroy(ui.layers.battery_percent);
}

void ui_init() {
    struct Fonts fonts;
    fonts.time = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_BOLD_50));
    fonts.date = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_32));
    fonts.month = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_MONO_20));
    fonts.weather = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_WEATHER_30));
    fonts.air_quality_index = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_BOLD_18));
    fonts.am_pm = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_MONO_16));
    fonts.icons = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_MATERIAL_30));
    fonts.battery = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_BOLD_20));

    struct Texts texts;
    struct Layers layers;
    struct State state;
    ui.layers = layers;
    ui.texts = texts;
    ui.fonts = fonts;
    ui.state = state;

    ui.window = window_create();
    window_set_window_handlers(ui.window, (WindowHandlers) {
        .load = ui_window_load,
        .unload = ui_window_unload,
    });

    const bool animated = true;
    window_stack_push(ui.window, animated);

    ui.state.battery = battery_state_service_peek();
    ui.state.bt_connected = connection_service_peek_pebble_app_connection();
    ui.state.condition = -999;
    ui.state.temperature = -999;
    ui.state.air_quality_index = -999;
    ui.state.is_day = 1;
    ui.state.elapsed_time = 0;
    ui.state.error = FETCH_ERROR;
    ui.state.retry_times = MAX_RETRIES;
    ui.texts.time_zero = false;
    strncpy(ui.texts.temperature, "", sizeof(ui.texts.temperature));
    strncpy(ui.texts.air_quality_index, "", sizeof(ui.texts.air_quality_index));
}

void ui_deinit() {
    window_destroy(ui.window);

    fonts_unload_custom_font(ui.fonts.time);
    fonts_unload_custom_font(ui.fonts.date);
    fonts_unload_custom_font(ui.fonts.month);
    fonts_unload_custom_font(ui.fonts.weather);
    fonts_unload_custom_font(ui.fonts.air_quality_index);
    fonts_unload_custom_font(ui.fonts.am_pm);
    fonts_unload_custom_font(ui.fonts.icons);
    fonts_unload_custom_font(ui.fonts.battery);
}
