#include <pebble.h>

#include "appinfo.h"
#include "ui.h"
#include "config.h"
#include "i18n.h"

//From https://github.com/smallstoneapps/message-queue/blob/master/message-queue.c#L222
/*static char *translate_error(AppMessageResult result) {
    switch (result) {
        case APP_MSG_OK: return "APP_MSG_OK";
        case APP_MSG_SEND_TIMEOUT: return "APP_MSG_SEND_TIMEOUT";
        case APP_MSG_SEND_REJECTED: return "APP_MSG_SEND_REJECTED";
        case APP_MSG_NOT_CONNECTED: return "APP_MSG_NOT_CONNECTED";
        case APP_MSG_APP_NOT_RUNNING: return "APP_MSG_APP_NOT_RUNNING";
        case APP_MSG_INVALID_ARGS: return "APP_MSG_INVALID_ARGS";
        case APP_MSG_BUSY: return "APP_MSG_BUSY";
        case APP_MSG_BUFFER_OVERFLOW: return "APP_MSG_BUFFER_OVERFLOW";
        case APP_MSG_ALREADY_RELEASED: return "APP_MSG_ALREADY_RELEASED";
        case APP_MSG_CALLBACK_ALREADY_REGISTERED: return "APP_MSG_CALLBACK_ALREADY_REGISTERED";
        case APP_MSG_CALLBACK_NOT_REGISTERED: return "APP_MSG_CALLBACK_NOT_REGISTERED";
        case APP_MSG_OUT_OF_MEMORY: return "APP_MSG_OUT_OF_MEMORY";
        case APP_MSG_CLOSED: return "APP_MSG_CLOSED";
        case APP_MSG_INTERNAL_ERROR: return "APP_MSG_INTERNAL_ERROR";
        default: return "UNKNOWN ERROR";
    }
}*/

static bool check_refresh(bool do_refresh, bool force_refresh) {
    bool refresh = false;
    if (ui.state.elapsed_time >= config.refresh_time && !ui.state.request_failed) {
        refresh = true;
    }
    else if (ui.state.elapsed_time >= config.wait_time && ui.state.request_failed) {
        refresh = true;
    }

    if ((refresh && do_refresh) || force_refresh) {
        ui.state.elapsed_time = 0;
        ui.state.request_failed = true;

        Tuplet value = TupletInteger(APP_KEY_FETCH, 1);
        DictionaryIterator *iter;
        app_message_outbox_begin(&iter);

        if (iter == NULL) {
            return refresh;
        }

        dict_write_tuplet(iter, &value);
        dict_write_end(iter);
        app_message_outbox_send();
        //AppMessageResult result = app_message_outbox_send();
        //APP_LOG(APP_LOG_LEVEL_DEBUG, "%s", translate_error(result));
    }

    return refresh;
}

static void handle_tick(struct tm *tick_time, TimeUnits units_changed) {
    if (units_changed & MINUTE_UNIT) {
        strftime(ui.texts.time, sizeof(ui.texts.time), clock_is_24h_style() ? "%H:%M" : "%I:%M", tick_time);

        //Remove leading 0
        if (ui.texts.time[0] == '0') {
            memmove(ui.texts.time, &ui.texts.time[1], sizeof(ui.texts.time) - 1);
            ui.texts.time_zero = true;
        }
        else {
            ui.texts.time_zero = false;
        }

        ui.state.elapsed_time++;
        if (ui.state.bt_connected) {
            check_refresh(true, false);
        }
        else {
            //Bluetooth not connected and we need to refresh
            bool refresh = check_refresh(false, false);
            if (refresh) {
                ui.state.condition = -999;
                strncpy(ui.texts.temperature, " ", sizeof(ui.texts.temperature));
                ui_weather_update();
            }
        }
    }

    if (units_changed & DAY_UNIT) {
        tr_date(tick_time);
    }

    if (units_changed & MONTH_UNIT) {
        tr_month(tick_time);
    }

    tr_am_pm(tick_time);
    ui_time_update();
    ui_colorize();
}

static void handle_failed_message(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
    //APP_LOG(APP_LOG_LEVEL_DEBUG, "%s", translate_error(reason));
    check_refresh(true, true);
}

static void handle_bluetooth(bool connected) {
    ui.state.bt_connected = connected;

    if (ui.state.bt_connected) {
        check_refresh(true, false);
    }
    else {
        if (config.vibrate_bluetooth == 1) {
            vibes_short_pulse();
        }
    }

    ui_weather_update();
}

static void handle_battery(BatteryChargeState charge_state) {
    ui.state.battery = charge_state;

    if (ui.state.battery.is_charging) {
        snprintf(ui.texts.battery_percent, sizeof(ui.texts.battery_percent), "+%d%%", ui.state.battery.charge_percent);
    }
    else {
        snprintf(ui.texts.battery_percent, sizeof(ui.texts.battery_percent), "%d%%", ui.state.battery.charge_percent);
    }

    ui_battery_update();
    ui_weather_update();
}

static void msg_received_handler(DictionaryIterator *iter, void *context) {
    (void) context;

    Tuple *t = dict_read_first(iter);
    while(t != NULL) {
        int key = t->key;
        int value = t->value->int32;
        switch(key) {
            case APP_KEY_TEMPERATURE:
                if (config.air_quality == 0) {
                    ui.state.elapsed_time = 0;
                    if (value == -999 || value == -998) {
                        strncpy(ui.texts.temperature, " ", sizeof(ui.texts.temperature));
                        ui.state.request_failed = true;
                    }
                    else {
                        snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d\u00b0", value);
                        ui.state.request_failed = false;
                    }
                }

                break;

            case APP_KEY_AIR_QUALITY_INDEX:
                if (config.air_quality == 1) {
                    ui.state.elapsed_time = 0;
                    if (value == -999 || value == -998) {
                        strncpy(ui.texts.temperature, " ", sizeof(ui.texts.temperature));
                        ui.state.request_failed = true;
                    }
                    else {
                        snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d", value);
                        ui.state.request_failed = false;
                    }
                }

                break;

            case APP_KEY_CONDITION:
                ui.state.condition = value;
                break;

            case APP_KEY_REFRESH_TIME:
                config.refresh_time = value;
                break;

            case APP_KEY_WAIT_TIME:
                config.wait_time = value;
                break;

            case APP_KEY_DAY_TEXT_COLOR:
                config.day_text_color = load_color(value);
                break;

            case APP_KEY_DAY_BACKGROUND_COLOR:
                config.day_background_color = load_color(value);
                break;

            case APP_KEY_NIGHT_TEXT_COLOR:
                config.night_text_color = load_color(value);
                break;

            case APP_KEY_NIGHT_BACKGROUND_COLOR:
                config.night_background_color = load_color(value);
                break;

            case APP_KEY_SUNRISE:
                config.sunrise = value;
                break;

            case APP_KEY_SUNSET:
                config.sunset = value;
                break;

            case APP_KEY_SHOW_AM_PM:
                config.show_am_pm = value;
                break;

            case APP_KEY_HIDE_BATTERY:
                config.hide_battery = value;
                break;

            case APP_KEY_VIBRATE_BLUETOOTH:
                config.vibrate_bluetooth = value;
                break;

            case APP_KEY_CHARGING_ICON:
                config.charging_icon = value;
                break;

            case APP_KEY_BT_DISCONNECT_ICON:
                config.bt_disconnect_icon = value;
                break;

            case APP_KEY_BATTERY_PERCENT:
                config.battery_percent = value;
                break;

            case APP_KEY_LANGUAGE:
                config.language = value;
                break;

            case APP_KEY_LAYOUT:
                config.layout = value;
                break;

            case APP_KEY_AIR_QUALITY:
                config.air_quality = value;
                break;
        }

        t = dict_read_next(iter);
    }

    ui_weather_update();
    //ui_time_update(); Called in handle_tick
    ui_battery_update();
    //ui_colorize(); Called in handle_tick
    ui_align();

    time_t now = time(NULL);
    struct tm *tick_time = localtime(&now);
    handle_tick(tick_time, SECOND_UNIT | MINUTE_UNIT | HOUR_UNIT | DAY_UNIT | MONTH_UNIT);

    save_config();
}

static void init(void) {
    setlocale(LC_ALL, "");

    load_config();

    ui_init();

    handle_battery(ui.state.battery);

    time_t now = time(NULL);
    struct tm *tick_time = localtime(&now);
    handle_tick(tick_time, SECOND_UNIT | MINUTE_UNIT | HOUR_UNIT | DAY_UNIT | MONTH_UNIT);

    #ifdef PBL_PLATFORM_APLITE
        free(tick_time); //Causes a crash on Basalt >=3.3
    #endif

    tick_timer_service_subscribe(MINUTE_UNIT, handle_tick);
    battery_state_service_subscribe(&handle_battery);
    bluetooth_connection_service_subscribe(&handle_bluetooth);
    app_message_register_outbox_failed(&handle_failed_message);

    app_message_register_inbox_received(msg_received_handler);
    app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
}

static void deinit(void) {
    ui_deinit();

    tick_timer_service_unsubscribe();
    battery_state_service_unsubscribe();
    bluetooth_connection_service_unsubscribe();
    app_message_deregister_callbacks();
}

int main(void) {
    init();
    app_event_loop();
    deinit();
}
