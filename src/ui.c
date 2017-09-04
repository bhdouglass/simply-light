#include "simply_light.h"
#include "ui.h"
#include "helpers.h"
#include "config.h"
#include "weather.h"
#include "i18n.h"

bool is_day = true;
bool is_sleeping = false;
bool is_obstructed = false;

int PWIDTH = 144;
int HALFPWIDTH = 72;
int PHEIGHT = 168;
int HALFPHEIGHT = 84;
int STATUS_BAR_ITEM_WIDTH = 46;

//TODO don't set font if we don't need to
void ui_set_info(int type, char *text) {
    if (config.status_bar1 == type) {
        if (type == STATUS_ITEMS_WEATHER_CONDITION || type == STATUS_ITEMS_BLUETOOTH_STATUS || type == STATUS_ITEMS_BATTERY_LEVEL_ICON) {
            text_layer_set_font(ui.layers.status_bar1, ui.fonts.status_icons);
        }
        else {
            text_layer_set_font(ui.layers.status_bar1, ui.fonts.status_text);
        }

        text_layer_set_text(ui.layers.status_bar1, text);
    }

    if (config.status_bar2 == type) {
        if (type == STATUS_ITEMS_WEATHER_CONDITION || type == STATUS_ITEMS_BLUETOOTH_STATUS || type == STATUS_ITEMS_BATTERY_LEVEL_ICON) {
            text_layer_set_font(ui.layers.status_bar2, ui.fonts.status_icons);
        }
        else {
            text_layer_set_font(ui.layers.status_bar2, ui.fonts.status_text);
        }

        text_layer_set_text(ui.layers.status_bar2, text);
    }

    if (config.status_bar3 == type) {
        if (type == STATUS_ITEMS_WEATHER_CONDITION || type == STATUS_ITEMS_BLUETOOTH_STATUS || type == STATUS_ITEMS_BATTERY_LEVEL_ICON) {
            text_layer_set_font(ui.layers.status_bar3, ui.fonts.status_icons);
        }
        else {
            text_layer_set_font(ui.layers.status_bar3, ui.fonts.status_text);
        }

        text_layer_set_text(ui.layers.status_bar3, text);
    }

    if (config.info_box_left == type) {
        if (type == STATUS_ITEMS_WEATHER_CONDITION || type == STATUS_ITEMS_BLUETOOTH_STATUS || type == STATUS_ITEMS_BATTERY_LEVEL_ICON) {
            text_layer_set_font(ui.layers.info_box_left, ui.fonts.info_icons);
        }
        else {
            text_layer_set_font(ui.layers.info_box_left, ui.fonts.info_text);
        }

        text_layer_set_text(ui.layers.info_box_left, text);
    }

    if (config.info_box_right == type) {
        if (type == STATUS_ITEMS_WEATHER_CONDITION || type == STATUS_ITEMS_BLUETOOTH_STATUS || type == STATUS_ITEMS_BATTERY_LEVEL_ICON) {
            text_layer_set_font(ui.layers.info_box_right, ui.fonts.info_icons);
        }
        else {
            text_layer_set_font(ui.layers.info_box_right, ui.fonts.info_text);
        }

        text_layer_set_text(ui.layers.info_box_right, text);
    }
}

void ui_set_datetime(struct tm *tick_time, TimeUnits units_changed) {
    if (units_changed & MINUTE_UNIT) {
        strftime(ui.texts.time, sizeof(ui.texts.time), clock_is_24h_style() ? "%H:%M" : "%I:%M", tick_time);

        //Remove leading 0
        if (ui.texts.time[0] == '0') {
            memmove(ui.texts.time, &ui.texts.time[1], sizeof(ui.texts.time) - 1);
        }
    }

    if (units_changed & DAY_UNIT) {
        tr_date(tick_time);
    }

    //TODO figure out how to make the translations accept the char* passed in. strftime must not like it
    if (units_changed & MONTH_UNIT) {
        tr_month(tick_time);
    }

    tr_am_pm(tick_time);

    //For pretty screenshots
    //SCREENSHOT_0 strncpy(ui.texts.time, "12:00", sizeof(ui.texts.time));
    //SCREENSHOT_0 strncpy(ui.texts.date, "Thu 28", sizeof(ui.texts.date));
    //SCREENSHOT_0 strncpy(ui.texts.month, "May", sizeof(ui.texts.month));
    //SCREENSHOT_1 strncpy(ui.texts.time, "6:30", sizeof(ui.texts.time));
    //SCREENSHOT_1 strncpy(ui.texts.date, "Thu 28", sizeof(ui.texts.date));
    //SCREENSHOT_1 strncpy(ui.texts.month, "February", sizeof(ui.texts.month));
    //SCREENSHOT_2 strncpy(ui.texts.time, "9:00", sizeof(ui.texts.time));
    //SCREENSHOT_2 strncpy(ui.texts.date, "Fri 27", sizeof(ui.texts.date));
    //SCREENSHOT_2 strncpy(ui.texts.month, "May", sizeof(ui.texts.month));
    //SCREENSHOT_3 strncpy(ui.texts.time, "9:00", sizeof(ui.texts.time));
    //SCREENSHOT_3 strncpy(ui.texts.date, "Fri 27", sizeof(ui.texts.date));
    //SCREENSHOT_3 strncpy(ui.texts.month, "May", sizeof(ui.texts.month));
    //SCREENSHOT_4 strncpy(ui.texts.time, "12:15", sizeof(ui.texts.time));
    //SCREENSHOT_4 strncpy(ui.texts.date, "Mon 5", sizeof(ui.texts.date));
    //SCREENSHOT_4 strncpy(ui.texts.month, "November", sizeof(ui.texts.month));

    text_layer_set_text(ui.layers.time, ui.texts.time);
    text_layer_set_text(ui.layers.date, ui.texts.date);
    text_layer_set_text(ui.layers.month, ui.texts.month);
    ui_set_info(STATUS_ITEMS_AMPM, ui.texts.ampm);

    //Update day/night flag
    if (config.sunrise > 0 && config.sunset > 0) {
        int minutes = tick_time->tm_hour * 60 + tick_time->tm_min;

        if (config.sunrise <= minutes && minutes < config.sunset) {
            is_day = true;
        }
        else {
            is_day = false;
        }
    }
    else {
        is_day = true;
    }
}

void ui_set_temperature(int temp, int error) {
    if (error == WEATHER_ERROR || error == FETCH_ERROR || temp == BAD_DATA) {
        strncpy(ui.texts.temperature, "-", sizeof(ui.texts.temperature));
    }
    else {
        snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d\u00b0", temp);
    }

    //For pretty screenshots
    //SCREENSHOT_0 strncpy(ui.texts.temperature, "75\u00b0", sizeof(ui.texts.temperature));
    //SCREENSHOT_1 strncpy(ui.texts.temperature, "32\u00b0", sizeof(ui.texts.temperature));
    //SCREENSHOT_2 strncpy(ui.texts.temperature, "50\u00b0", sizeof(ui.texts.temperature));
    //SCREENSHOT_3 strncpy(ui.texts.temperature, "40\u00b0", sizeof(ui.texts.temperature));

    ui_set_info(STATUS_ITEMS_TEMPERATURE, ui.texts.temperature);
}

void ui_set_condition(int condition, int error) {
    if (error == FETCH_ERROR) {
        if (connection_service_peek_pebble_app_connection()) {
            strncpy(ui.texts.condition, "\uf03e", sizeof(ui.texts.condition));
        }
        else {
            strncpy(ui.texts.condition, "\uf27f", sizeof(ui.texts.condition));
        }
    }
    else if (error == WEATHER_ERROR) {
        strncpy(ui.texts.condition, "\uf21b", sizeof(ui.texts.condition));
    }
    else if (error == LOCATION_ERROR) {
        strncpy(ui.texts.condition, "\uf1aa", sizeof(ui.texts.condition));
    }
    else if (error == AQI_ERROR) {
        strncpy(ui.texts.condition, "\uf368", sizeof(ui.texts.condition));
    }
    else {
        weather_set_condition(condition, is_day, ui.texts.condition);
    }

    //For pretty screenshots
    //SCREENSHOT_0 strncpy(ui.texts.condition, "\uf00d", sizeof(ui.texts.condition));
    //SCREENSHOT_1 strncpy(ui.texts.condition, "\uf02a", sizeof(ui.texts.condition));
    //SCREENSHOT_2 strncpy(ui.texts.condition, "\uf008", sizeof(ui.texts.condition));
    //SCREENSHOT_3 strncpy(ui.texts.condition, "\uf056", sizeof(ui.texts.condition));

    ui_set_info(STATUS_ITEMS_WEATHER_CONDITION, ui.texts.condition);
}

void ui_set_aqi(int aqi, int error) {
    if (error == AQI_ERROR || error == FETCH_ERROR || aqi == BAD_DATA) {
        strncpy(ui.texts.aqi, "-", sizeof(ui.texts.aqi));
    }
    else {
        snprintf(ui.texts.aqi, sizeof(ui.texts.aqi), "%d", aqi);
    }

    //For pretty screenshots
    //SCREENSHOT_1 snprintf(ui.texts.aqi, sizeof(ui.texts.aqi), "%d", 30);

    ui_set_info(STATUS_ITEMS_AIR_QUALITY_INDEX, ui.texts.aqi);
}

void ui_set_bluetooth(bool connected) {
    if (connected) {
        strncpy(ui.texts.bluetooth, "\uf282", sizeof(ui.texts.bluetooth));
    }
    else {
        strncpy(ui.texts.bluetooth, "\uf27f", sizeof(ui.texts.bluetooth));
    }

    ui_set_info(STATUS_ITEMS_BLUETOOTH_STATUS, ui.texts.bluetooth);
}

void ui_set_battery_level(int level) {
    snprintf(ui.texts.battery_percent, sizeof(ui.texts.battery_percent), "%d%%", level);

    if (!config.hide_battery) {
        layer_mark_dirty(ui.layers.battery);
    }

    if (level >= 80) {
        strncpy(ui.texts.battery_icon, "\uf240", sizeof(ui.texts.battery_icon));
    }
    else if (level >= 60) {
        strncpy(ui.texts.battery_icon, "\uf241", sizeof(ui.texts.battery_icon));
    }
    else if (level >= 40) {
        strncpy(ui.texts.battery_icon, "\uf242", sizeof(ui.texts.battery_icon));
    }
    else if (level >= 20) {
        strncpy(ui.texts.battery_icon, "\uf243", sizeof(ui.texts.battery_icon));
    }
    else {
        strncpy(ui.texts.battery_icon, "\uf244", sizeof(ui.texts.battery_icon));
    }

    ui_set_info(STATUS_ITEMS_BATTERY_LEVEL, ui.texts.battery_percent);
    ui_set_info(STATUS_ITEMS_BATTERY_LEVEL_ICON, ui.texts.battery_icon);
}

void ui_set_steps(int steps) {
    //For pretty screenshots
    //SCREENSHOT_0 steps = 2600;

    if (steps >= 1000000) {
        tr_msteps((float)(steps) / 1000000);
    }
    else if (steps >= 1000) {
        tr_ksteps((float)(steps) / 1000);
    }
    else {
        snprintf(ui.texts.steps_short, sizeof(ui.texts.steps_short), "%d", steps);
    }

    snprintf(ui.texts.steps, sizeof(ui.texts.steps), "%d", steps);

    ui_set_info(STATUS_ITEMS_STEPS_SHORT, ui.texts.steps_short);
    ui_set_info(STATUS_ITEMS_STEPS_FULL, ui.texts.steps);
}

void ui_set_walk_distance(float distance, MeasurementSystem sys) {
    //For pretty screenshots
    //SCREENSHOT_0 distance = 1770.28; //1.1 miles in meters

    switch (sys) {
        case MeasurementSystemMetric:
            tr_kdistance(distance / 1000);
            break;

        case MeasurementSystemImperial:
            tr_midistance(distance * 0.000621371); //Meters to miles
            break;

        case MeasurementSystemUnknown:
            strncpy(ui.texts.distance, "-", sizeof(ui.texts.distance));
            break;
    }

    ui_set_info(STATUS_ITEMS_DISTANCE_WALKED, ui.texts.distance);
}

void ui_set_calories(int calories) {
    //For pretty screenshots
    //SCREENSHOT_0 calories = 2350;

    snprintf(ui.texts.calories, sizeof(ui.texts.calories), "%d", calories);

    ui_set_info(STATUS_ITEMS_CALORIES_BURNED, ui.texts.calories);
}

void ui_set_sleeping(bool sleeping, int sleep_time, int restful_sleep_time) {
    is_sleeping = sleeping;

    if (sleep_time != -1) { //So is_sleeping can be updated without the sleep time
        float sleep_hours = (float) sleep_time / SECONDS_PER_HOUR;

        snprintf(ui.texts.sleep_time, sizeof(ui.texts.sleep_time), "%d.%d", (int)(sleep_hours), (int)(sleep_hours * 10) % 10);
        ui_set_info(STATUS_ITEMS_SLEEP_TIME, ui.texts.sleep_time);
    }

    if (restful_sleep_time != -1) { //So is_sleeping can be updated without the sleep time
        float restful_sleep_hours = (float) restful_sleep_time / SECONDS_PER_HOUR;

        snprintf(ui.texts.restful_sleep_time, sizeof(ui.texts.restful_sleep_time), "%d.%d", (int)(restful_sleep_hours), (int)(restful_sleep_hours * 10) % 10);
        ui_set_info(STATUS_ITEMS_RESTFUL_SLEEP_TIME, ui.texts.restful_sleep_time);
    }

    ui_layout();
}

void ui_set_unobstructed_area(GRect unobstructed_area) {
    bool new_is_obstructed = true;

    if (unobstructed_area.size.w == PWIDTH && unobstructed_area.size.h == PHEIGHT) {
        new_is_obstructed = false;
    }

    if (new_is_obstructed != is_obstructed) {
        is_obstructed = new_is_obstructed;

        ui_layout();
    }
}

void ui_refresh_info() {
    ui_set_info(STATUS_ITEMS_TEMPERATURE, ui.texts.temperature);
    ui_set_info(STATUS_ITEMS_WEATHER_CONDITION, ui.texts.condition);
    ui_set_info(STATUS_ITEMS_AIR_QUALITY_INDEX, ui.texts.aqi);
    ui_set_info(STATUS_ITEMS_BLUETOOTH_STATUS, ui.texts.bluetooth);
    ui_set_info(STATUS_ITEMS_BATTERY_LEVEL, ui.texts.battery_percent);
    ui_set_info(STATUS_ITEMS_BATTERY_LEVEL_ICON, ui.texts.battery_icon);
    ui_set_info(STATUS_ITEMS_STEPS_SHORT, ui.texts.steps_short);
    ui_set_info(STATUS_ITEMS_STEPS_FULL, ui.texts.steps);
    ui_set_info(STATUS_ITEMS_DISTANCE_WALKED, ui.texts.distance);
    ui_set_info(STATUS_ITEMS_CALORIES_BURNED, ui.texts.calories);
    ui_set_info(STATUS_ITEMS_SLEEP_TIME, ui.texts.sleep_time);
    ui_set_info(STATUS_ITEMS_RESTFUL_SLEEP_TIME, ui.texts.restful_sleep_time);
    ui_set_info(STATUS_ITEMS_AMPM, ui.texts.ampm);
    ui_set_info(STATUS_ITEMS_EMPTY, "");
}

void ui_layout() {
    int top = MARGINTOP;

    if ((is_sleeping && config.auto_sleep_mode) || (config.low_power_quiet_mode && quiet_time_is_active())) {
        text_layer_move(ui.layers.time, 0, top + (PHEIGHT - top) * 0.20);
        text_layer_move(ui.layers.date, 0, top + (PHEIGHT - top) * 0.50);

        text_layer_hide(ui.layers.status_bar);
        text_layer_hide(ui.layers.status_bar1);
        text_layer_hide(ui.layers.status_bar2);
        text_layer_hide(ui.layers.status_bar3);
        layer_hide(ui.layers.battery);
        text_layer_hide(ui.layers.month);
        text_layer_hide(ui.layers.info_box_left);
        text_layer_hide(ui.layers.info_box_right);
    }
    else {
        text_layer_show(ui.layers.date);
        text_layer_show(ui.layers.month);
        text_layer_show(ui.layers.info_box_left);
        text_layer_show(ui.layers.info_box_right);

        if (config.show_status_bar == 1) {
            top = MARGINTOP_WITH_STATUS_BAR;
        }

        if (config.layout == 1) { //Reverse Classic layout
            if (config.hide_battery == 1) {
                text_layer_move(ui.layers.time, 0, top + (PHEIGHT - top) * 0.62);
                text_layer_move(ui.layers.date, 0, top + (PHEIGHT - top) * 0.42);
            }
            else {
                text_layer_move(ui.layers.time, 0, top + (PHEIGHT - top) * 0.64);
                text_layer_move(ui.layers.date, 0, top + (PHEIGHT - top) * 0.40);
            }

            layer_move(ui.layers.battery, 0, top + (PHEIGHT - top) * 0.44);
            text_layer_move(ui.layers.month, 0, top + (PHEIGHT - top) * 0.28);
            text_layer_move(ui.layers.info_box_left, INFO_MARGIN, top + (PHEIGHT - top) * 0.05);
            text_layer_move(ui.layers.info_box_right, HALFPWIDTH + 1, top + (PHEIGHT - top) * 0.05);
        }
        else { //Classic layout
            if (config.hide_battery == 1) {
                text_layer_move(ui.layers.time, 0, top + (PHEIGHT - top) * 0.02);
                text_layer_move(ui.layers.date, 0, top + (PHEIGHT - top) * 0.36);
            }
            else {
                text_layer_move(ui.layers.time, 0, top);
                text_layer_move(ui.layers.date, 0, top + (PHEIGHT - top) * 0.38);
            }

            layer_move(ui.layers.battery, 0, top + (PHEIGHT - top) * 0.18);
            text_layer_move(ui.layers.month, 0, top + (PHEIGHT - top) * 0.59);
            text_layer_move(ui.layers.info_box_left, INFO_MARGIN, top + (PHEIGHT - top) * 0.74);
            text_layer_move(ui.layers.info_box_right, HALFPWIDTH + 1, top + (PHEIGHT - top) * 0.74);
        }

        if (config.hide_battery == 1) {
            layer_hide(ui.layers.battery);
        }
        else {
            layer_show(ui.layers.battery);
        }

        if (config.show_status_bar == 1) {
            text_layer_show(ui.layers.status_bar);
            text_layer_show(ui.layers.status_bar2);

            #ifdef PBL_ROUND
                text_layer_hide(ui.layers.status_bar1);
                text_layer_hide(ui.layers.status_bar3);
            #else
                text_layer_show(ui.layers.status_bar1);
                text_layer_show(ui.layers.status_bar3);
            #endif
        }
        else {
            text_layer_hide(ui.layers.status_bar);
            text_layer_hide(ui.layers.status_bar1);
            text_layer_hide(ui.layers.status_bar2);
            text_layer_hide(ui.layers.status_bar3);
        }

        if (is_obstructed) {
            text_layer_hide(ui.layers.info_box_left);
            text_layer_hide(ui.layers.info_box_right);
            text_layer_hide(ui.layers.month);
        }
        else {
            text_layer_show(ui.layers.info_box_left);
            text_layer_show(ui.layers.info_box_right);
            text_layer_show(ui.layers.month);
        }
    }
}

void ui_colorize() {
    GColor text_color;
    GColor background_color;
    if (is_day) {
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
    text_layer_set_text_color(ui.layers.info_box_left, text_color);
    text_layer_set_text_color(ui.layers.info_box_right, text_color);

    GColor status_bar_text_color;
    GColor status_bar_color;

    if (is_day) {
        status_bar_text_color = get_color(config.status_bar_day_text_color);
        status_bar_color = get_color(config.status_bar_day_color);
    }
    else {
        status_bar_text_color = get_color(config.status_bar_night_text_color);
        status_bar_color = get_color(config.status_bar_night_color);
    }

    text_layer_set_text_color(ui.layers.status_bar1, status_bar_text_color);
    text_layer_set_text_color(ui.layers.status_bar2, status_bar_text_color);
    text_layer_set_text_color(ui.layers.status_bar3, status_bar_text_color);
    text_layer_set_background_color(ui.layers.status_bar, status_bar_color);
}

void ui_battery_dirty(Layer *layer, GContext *ctx) {
    BatteryChargeState battery = battery_state_service_peek();
    int width = battery.charge_percent * ((float)(PWIDTH) / 100);

    int offset = (PWIDTH - width) / 2;
    GColor text_color;

    if (is_day) {
        text_color = get_color(config.day_text_color);
    }
    else {
        text_color = get_color(config.night_text_color);
    }

    graphics_context_set_fill_color(ctx, text_color);
    graphics_fill_rect(ctx, GRect(offset, 29, width, 4), 0, GCornerNone);
}

void ui_window_load(Window *window) {
    ui.layers.window = window_get_root_layer(window);

    //Dynamically set sizes
    GRect window_bounds = layer_get_bounds(ui.layers.window);
    PWIDTH = window_bounds.size.w;
    HALFPWIDTH = window_bounds.size.w / 2;
    PHEIGHT = window_bounds.size.h;
    HALFPHEIGHT = window_bounds.size.h / 2;
    STATUS_BAR_ITEM_WIDTH = (PWIDTH - (STATUS_BAR_MARGIN * 2)) / 3;

    ui.layers.time = text_layer_init(
        ui.layers.window,
        GRect(0, MARGINTOP, PWIDTH, 100),
        ui.fonts.time_text,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.battery = layer_init(ui.layers.window, GRect(0, MARGINTOP + 29, PWIDTH, 100), ui_battery_dirty);

    ui.layers.date = text_layer_init(
        ui.layers.window,
        GRect(0, MARGINTOP + 60, PWIDTH, 100),
        ui.fonts.info_text,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.month = text_layer_init(
        ui.layers.window,
        GRect(0, MARGINTOP + 96, PWIDTH, 28),
        ui.fonts.month_text,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.info_box_left = text_layer_init(
        ui.layers.window,
        GRect(INFO_MARGIN, MARGINTOP + 118, HALFPWIDTH + 10, 50),
        ui.fonts.info_text,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    ui.layers.info_box_right = text_layer_init(
        ui.layers.window,
        GRect(HALFPWIDTH + 1, MARGINTOP + 119, (HALFPWIDTH - INFO_MARGIN), 50),
        ui.fonts.info_icons,
        GColorClear,
        GColorBlack,
        GTextAlignmentCenter
    );

    //This is a text layer to avoid having a dirty funciton for just coloring it
    ui.layers.status_bar = text_layer_init(
        ui.layers.window,
        GRect(0, 0, PWIDTH, STATUS_BAR_HEIGHT),
        ui.fonts.status_text,
        get_color(config.status_bar_day_color),
        get_color(config.status_bar_day_text_color),
        GTextAlignmentLeft
    );

    ui.layers.status_bar1 = text_layer_init(
        ui.layers.window,
        GRect(STATUS_BAR_MARGIN, STATUS_BAR_MARGINTOP, STATUS_BAR_ITEM_WIDTH, (STATUS_BAR_HEIGHT - STATUS_BAR_MARGINTOP)),
        ui.fonts.status_text,
        GColorClear,
        get_color(config.status_bar_day_text_color),
        GTextAlignmentLeft
    );

    ui.layers.status_bar2 = text_layer_init(
        ui.layers.window,
        GRect(STATUS_BAR_MARGIN + STATUS_BAR_ITEM_WIDTH, STATUS_BAR_MARGINTOP, STATUS_BAR_ITEM_WIDTH, (STATUS_BAR_HEIGHT - STATUS_BAR_MARGINTOP)),
        ui.fonts.status_text,
        GColorClear,
        get_color(config.status_bar_day_text_color),
        GTextAlignmentCenter
    );

    ui.layers.status_bar3 = text_layer_init(
        ui.layers.window,
        GRect(STATUS_BAR_MARGIN + (STATUS_BAR_ITEM_WIDTH * 2), STATUS_BAR_MARGINTOP, STATUS_BAR_ITEM_WIDTH, (STATUS_BAR_HEIGHT - STATUS_BAR_MARGINTOP)),
        ui.fonts.status_text,
        GColorClear,
        get_color(config.status_bar_day_text_color),
        GTextAlignmentRight
    );

    ui_layout();
    ui_colorize();

    //Check if we are obstructed
    ui_set_unobstructed_area(layer_get_unobstructed_bounds(ui.layers.window));
}

void ui_window_unload(Window *window) {
    text_layer_destroy_safe(ui.layers.time);
    layer_destroy_safe(ui.layers.battery);
    text_layer_destroy_safe(ui.layers.date);
    text_layer_destroy_safe(ui.layers.month);
    text_layer_destroy_safe(ui.layers.info_box_left);
    text_layer_destroy_safe(ui.layers.info_box_right);
    text_layer_destroy_safe(ui.layers.status_bar);
    text_layer_destroy_safe(ui.layers.status_bar1);
    text_layer_destroy_safe(ui.layers.status_bar2);
    text_layer_destroy_safe(ui.layers.status_bar3);
}

void ui_init() {
    struct Fonts fonts = {};
    struct Texts texts = {};
    struct Layers layers = {};

    ui.layers = layers;
    ui.texts = texts;
    ui.fonts = fonts;

    ui.fonts.time_text = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_BOLD_50);
    ui.fonts.info_text = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_32);
    ui.fonts.status_text = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_BOLD_14);
    ui.fonts.month_text = fonts_load_resource_font(RESOURCE_ID_DROIDSANS_MONO_20);
    ui.fonts.info_icons = fonts_load_resource_font(RESOURCE_ID_ICONS_32);
    ui.fonts.status_icons = fonts_load_resource_font(RESOURCE_ID_ICONS_14);

    strncpy(ui.texts.date, "", sizeof(ui.texts.date));
    strncpy(ui.texts.time, "", sizeof(ui.texts.time));
    strncpy(ui.texts.month, "", sizeof(ui.texts.month));
    strncpy(ui.texts.temperature, "-", sizeof(ui.texts.temperature));
    strncpy(ui.texts.aqi, "-", sizeof(ui.texts.aqi));
    strncpy(ui.texts.condition, "", sizeof(ui.texts.condition));
    strncpy(ui.texts.ampm, "", sizeof(ui.texts.ampm));
    strncpy(ui.texts.battery_percent, "", sizeof(ui.texts.battery_percent));
    strncpy(ui.texts.battery_icon, "", sizeof(ui.texts.battery_icon));
    strncpy(ui.texts.bluetooth, "", sizeof(ui.texts.bluetooth));
    strncpy(ui.texts.steps_short, "-", sizeof(ui.texts.steps_short));
    strncpy(ui.texts.steps, "-", sizeof(ui.texts.steps));
    strncpy(ui.texts.distance, "-", sizeof(ui.texts.distance));
    strncpy(ui.texts.calories, "-", sizeof(ui.texts.calories));
    strncpy(ui.texts.sleep_time, "-", sizeof(ui.texts.sleep_time));
    strncpy(ui.texts.restful_sleep_time, "-", sizeof(ui.texts.restful_sleep_time));

    ui.window = window_create();
    window_set_window_handlers(ui.window, (WindowHandlers) {
        .load = ui_window_load,
        .unload = ui_window_unload,
    });

    const bool animated = true;
    window_stack_push(ui.window, animated);
}

void ui_deinit() {
    window_destroy(ui.window);

    fonts_unload_custom_font_safe(ui.fonts.time_text);
    fonts_unload_custom_font_safe(ui.fonts.info_text);
    fonts_unload_custom_font_safe(ui.fonts.status_text);
    fonts_unload_custom_font_safe(ui.fonts.month_text);
    fonts_unload_custom_font_safe(ui.fonts.info_icons);
    fonts_unload_custom_font_safe(ui.fonts.status_icons);
}
