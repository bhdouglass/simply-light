#include <pebble.h>

#include "simply_light.h"
#include "appinfo.h"
#include "ui.h"
#include "config.h"
#include "i18n.h"

int retry_times = MAX_RETRIES;
int elapsed_time = 0;
int error = FETCH_ERROR;
bool sleeping = false;
int sleeping_movements = 0;

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
    if (elapsed_time >= config.refresh_time && error == NO_ERROR) {
        refresh = true;
    }
    else if (elapsed_time >= config.wait_time && error != NO_ERROR) {
        refresh = true;
    }

    //APP_LOG(APP_LOG_LEVEL_DEBUG, "refresh_time: %d, error: %d, elapsed_time: %d, wait_time: %d", config.refresh_time, error, elapsed_time, config.wait_time);
    //APP_LOG(APP_LOG_LEVEL_DEBUG, "refresh: %d, do_refresh: %d, force_refresh: %d", refresh, do_refresh, force_refresh);

    if (sleeping && config.auto_sleep_mode) {
        force_refresh = false;
        do_refresh = false;
        error = NO_ERROR;
    }

    if ((refresh && do_refresh) || force_refresh) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "refreshing");

        elapsed_time = 0;
        error = FETCH_ERROR;

        Tuplet value = TupletInteger(APP_KEY_FETCH, 1);
        DictionaryIterator *iter;
        app_message_outbox_begin(&iter);
        //AppMessageResult begin_result = app_message_outbox_begin(&iter);
        //APP_LOG(APP_LOG_LEVEL_DEBUG, "%s", translate_error(begin_result));

        if (iter == NULL) {
            return refresh;
        }

        dict_write_tuplet(iter, &value);
        dict_write_end(iter);
        app_message_outbox_send();
        //AppMessageResult send_result = app_message_outbox_send();
        //APP_LOG(APP_LOG_LEVEL_DEBUG, "%s", translate_error(send_result));
    }

    return refresh;
}

static void handle_tick(struct tm *tick_time, TimeUnits units_changed) {
    if (units_changed & HOUR_UNIT && config.hourly_vibrate == 1) {
        vibes_short_pulse();
    }

    elapsed_time++;
    if (connection_service_peek_pebble_app_connection()) {
        check_refresh(true, false);
    }
    else {
        //Bluetooth not connected and we need to refresh
        bool refresh = check_refresh(false, false);
        if (refresh) {
            ui_set_temperature(BAD_DATA, FETCH_ERROR);
            ui_set_condition(BAD_DATA, FETCH_ERROR);
            ui_set_aqi(BAD_DATA, FETCH_ERROR);
        }
    }

    ui_set_datetime(tick_time, units_changed);
    ui_colorize(); //TODO only colorize when changing from night to day
}

static void msg_failed_handler(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
    //APP_LOG(APP_LOG_LEVEL_DEBUG, "message failed to send: %s", translate_error(reason));
    error = FETCH_ERROR;
    if (connection_service_peek_pebble_app_connection() && retry_times > 0) {
        check_refresh(true, true);
        retry_times--;
    }
}

/*static void msg_droped_handler(AppMessageResult reason, void *context) {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "message dropped: %s", translate_error(reason));
}*/

//static void msg_sent_handler(DictionaryIterator *iterator, void *context) {
//    APP_LOG(APP_LOG_LEVEL_DEBUG, "message sent sucessfully");
//}

static void handle_bluetooth(bool connected) {
    if (connected) {
        bool refresh = check_refresh(true, false);
        if (refresh) {
            ui_set_temperature(BAD_DATA, FETCH_ERROR);
            ui_set_condition(BAD_DATA, FETCH_ERROR);
            ui_set_aqi(BAD_DATA, FETCH_ERROR);
        }
    }
    else {
        if (config.vibrate_bluetooth == 1) {
            vibes_short_pulse();
        }
    }

    ui_set_bluetooth(connected);
}

static void handle_battery(BatteryChargeState battery) {
    ui_set_battery_level(battery.charge_percent);
}

static void health_update() {
    time_t start = time_start_of_today();
    time_t end = time(NULL);

    HealthMetric step_metric = HealthMetricStepCount;
    HealthServiceAccessibilityMask step_mask = health_service_metric_accessible(step_metric, start, end);
    if (step_mask & HealthServiceAccessibilityMaskAvailable) {
        int steps = (int) health_service_sum_today(step_metric);
        ui_set_steps(steps);
    }
    else {
        ui_set_steps(0);
    }

    HealthMetric distance_metric = HealthMetricWalkedDistanceMeters;
    HealthServiceAccessibilityMask distance_mask = health_service_metric_accessible(distance_metric, start, end);
    if (distance_mask & HealthServiceAccessibilityMaskAvailable) {
        float distance = (float) health_service_sum_today(distance_metric);
        MeasurementSystem sys = health_service_get_measurement_system_for_display(distance_metric);
        ui_set_walk_distance(distance, sys);
    }
    else {
        ui_set_walk_distance(0, MeasurementSystemUnknown);
    }

    int kcal = 0;
    HealthMetric calories_metric = HealthMetricActiveKCalories;
    HealthServiceAccessibilityMask calories_mask = health_service_metric_accessible(calories_metric, start, end);
    if (calories_mask & HealthServiceAccessibilityMaskAvailable) {
        kcal += (int) health_service_sum_today(calories_metric);
    }

    HealthMetric resting_calories_metric = HealthMetricRestingKCalories;
    HealthServiceAccessibilityMask resting_calories_mask = health_service_metric_accessible(resting_calories_metric, start, end);
    if (resting_calories_mask & HealthServiceAccessibilityMaskAvailable) {
        kcal += (int) health_service_sum_today(resting_calories_metric);
    }

    ui_set_calories(kcal);
}

static void sleep_update() {
    time_t start = time(NULL) - SECONDS_PER_HOUR; //An hour ago
    time_t end = time(NULL);
    HealthServiceAccessibilityMask activity_mask = health_service_any_activity_accessible(HealthActivityMaskAll, start, end);

    if (activity_mask & HealthServiceAccessibilityMaskAvailable) {
        HealthActivityMask activities = health_service_peek_current_activities();

        if (activities & HealthActivitySleep || activities & HealthActivityRestfulSleep) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "The user is sleeping");
            sleeping = true;
            sleeping_movements = 0;
        }
        else {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "The user is not sleeping");
            sleeping = false;
        }

        ui_set_sleeping(sleeping);
    }
    else {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "No activities");
        sleeping = false;
        ui_set_sleeping(sleeping);
    }
}

static void handle_health(HealthEventType event, void *context) {
    switch(event) {
        case HealthEventSignificantUpdate:
            sleep_update();
            health_update();
            break;

        case HealthEventMovementUpdate:
            APP_LOG(APP_LOG_LEVEL_DEBUG, "Movement!");
            if (sleeping) {
                sleeping_movements++;

                if (sleeping_movements > 2) {
                    APP_LOG(APP_LOG_LEVEL_DEBUG, "The user has moved too much and is likely awake");

                    sleeping_movements = 0;
                    sleeping = false;
                    ui_set_sleeping(sleeping);
                }
            }

            health_update();
            break;

        case HealthEventSleepUpdate:
            sleep_update();
            break;
    }
}

static void msg_received_handler(DictionaryIterator *iter, void *context) {
    int temperature = NO_DATA;
    int condition = NO_DATA;
    int aqi = NO_DATA;
    bool config_update = false;
    bool sun_update = false;
    int e_time = 0;

    Tuple *t = dict_read_first(iter);
    while(t != NULL) {
        int key = t->key;
        int value = t->value->int32;

        //APP_LOG(APP_LOG_LEVEL_DEBUG, "inbox %d => %d", key, value);

        switch(key) {
            case APP_KEY_ERR:
                error = value;

                break;

            case APP_KEY_TEMPERATURE:
                temperature = value;
                elapsed_time = 0;
                retry_times = MAX_RETRIES;

                break;

            case APP_KEY_AIR_QUALITY_INDEX:
                aqi = value;
                elapsed_time = 0;
                retry_times = MAX_RETRIES;

                break;

            case APP_KEY_CONDITION:
                condition = value;
                break;

            case APP_KEY_SUNRISE:
                sun_update = true;
                config.sunrise = value;
                break;

            case APP_KEY_SUNSET:
                sun_update = true;
                config.sunset = value;
                break;

            case APP_KEY_ELAPSED_TIME:
                e_time = value;
                break;

<%= config_messages %>
        }

        t = dict_read_next(iter);
    }

    if (e_time != 0) {
        elapsed_time = e_time;
        APP_LOG(APP_LOG_LEVEL_DEBUG, "elapsed_time: %d", elapsed_time);
    }

    if (temperature != NO_DATA) {
        ui_set_temperature(temperature, error);
    }

    if (condition != NO_DATA) {
        ui_set_condition(condition, error);
    }

    if (aqi != NO_DATA) {
        ui_set_aqi(aqi, error);
    }

    //TODO have the JS only send sunrise/sunset when it changes
    if (config_update || sun_update) {
        save_config();

        time_t now = time(NULL);
        struct tm *tick_time = localtime(&now);

        ui_set_datetime(tick_time, MINUTE_UNIT | DAY_UNIT | MONTH_UNIT);
    }

    if (config_update) {
        ui_layout();
        ui_colorize();
        ui_refresh_status_bar();
    }
}

static void init(void) {
    setlocale(LC_ALL, "");

    load_config();

    ui_init();
    ui_set_condition(BAD_DATA, error);
    ui_set_bluetooth(connection_service_peek_pebble_app_connection());

    handle_battery(battery_state_service_peek());

    time_t now = time(NULL);
    struct tm *tick_time = localtime(&now);
    handle_tick(tick_time, MINUTE_UNIT | DAY_UNIT | MONTH_UNIT);

    tick_timer_service_subscribe(MINUTE_UNIT, handle_tick);
    battery_state_service_subscribe(&handle_battery);
    bluetooth_connection_service_subscribe(&handle_bluetooth);

    #ifdef PBL_HEALTH
        health_service_events_subscribe(&handle_health, NULL);
    #endif

    app_message_register_outbox_failed(&msg_failed_handler);
    app_message_register_inbox_received(&msg_received_handler);
    //app_message_register_inbox_dropped(&msg_droped_handler);
    //app_message_register_outbox_sent(&msg_sent_handler);
    app_message_open(640, 64);
}

static void deinit(void) {
    ui_deinit();

    tick_timer_service_unsubscribe();
    battery_state_service_unsubscribe();
    bluetooth_connection_service_unsubscribe();
    health_service_events_unsubscribe();
    app_message_deregister_callbacks();
}

int main(void) {
    init();
    app_event_loop();
    deinit();
}
