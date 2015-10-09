#include <pebble.h>

#include "appinfo.h"
#include "config.h"

void load_config() {
    config.sunrise = -1;
    config.sunset = -1;
    config.refresh_time = 30;
    config.wait_time = 1;
    config.show_am_pm = 0;
    config.hide_battery = 0;
    config.vibrate_bluetooth = 0;
    config.charging_icon = 1;
    config.bt_disconnect_icon = 1;
    config.battery_percent = 0;
    config.day_text_color = 0;
    config.day_background_color = 1;
    config.night_text_color = 0;
    config.night_background_color = 1;
    config.language = 0;
    config.layout = 0;
    config.air_quality = 0;
    config.aqi_degree = 0;
    config.hourly_vibrate = 0;

    if (persist_exists(APP_KEY_DAY_TEXT_COLOR)) {
        config.day_text_color = persist_read_int(APP_KEY_DAY_TEXT_COLOR);
    }

    if (persist_exists(APP_KEY_DAY_BACKGROUND_COLOR)) {
        config.day_background_color = persist_read_int(APP_KEY_DAY_BACKGROUND_COLOR);
    }

    if (persist_exists(APP_KEY_NIGHT_TEXT_COLOR)) {
        config.night_text_color = persist_read_int(APP_KEY_NIGHT_TEXT_COLOR);
    }

    if (persist_exists(APP_KEY_NIGHT_BACKGROUND_COLOR)) {
        config.night_background_color = persist_read_int(APP_KEY_NIGHT_BACKGROUND_COLOR);
    }

    if (persist_exists(APP_KEY_SUNRISE)) {
        config.sunrise = persist_read_int(APP_KEY_SUNRISE);
    }

    if (persist_exists(APP_KEY_SUNSET)) {
        config.sunset = persist_read_int(APP_KEY_SUNSET);
    }

    if (persist_exists(APP_KEY_SHOW_AM_PM)) {
        config.show_am_pm = persist_read_int(APP_KEY_SHOW_AM_PM);
    }

    if (persist_exists(APP_KEY_HIDE_BATTERY)) {
        config.hide_battery = persist_read_int(APP_KEY_HIDE_BATTERY);
    }

    if (persist_exists(APP_KEY_VIBRATE_BLUETOOTH)) {
        config.vibrate_bluetooth = persist_read_int(APP_KEY_VIBRATE_BLUETOOTH);
    }

    if (persist_exists(APP_KEY_CHARGING_ICON)) {
        config.charging_icon = persist_read_int(APP_KEY_CHARGING_ICON);
    }

    if (persist_exists(APP_KEY_BT_DISCONNECT_ICON)) {
        config.bt_disconnect_icon = persist_read_int(APP_KEY_BT_DISCONNECT_ICON);
    }

    if (persist_exists(APP_KEY_BATTERY_PERCENT)) {
        config.battery_percent = persist_read_int(APP_KEY_BATTERY_PERCENT);
    }

    if (persist_exists(APP_KEY_LANGUAGE)) {
        config.language = persist_read_int(APP_KEY_LANGUAGE);
    }

    if (persist_exists(APP_KEY_LAYOUT)) {
        config.layout = persist_read_int(APP_KEY_LAYOUT);
    }

    if (persist_exists(APP_KEY_AIR_QUALITY)) {
        config.air_quality = persist_read_int(APP_KEY_AIR_QUALITY);
    }

    if (persist_exists(APP_KEY_AQI_DEGREE)) {
        config.aqi_degree = persist_read_int(APP_KEY_AQI_DEGREE);
    }

    if (persist_exists(APP_KEY_HOURLY_VIBRATE)) {
        config.hourly_vibrate = persist_read_int(APP_KEY_HOURLY_VIBRATE);
    }
}

void save_config() {
    persist_write_int(APP_KEY_DAY_TEXT_COLOR, config.day_text_color);
    persist_write_int(APP_KEY_DAY_BACKGROUND_COLOR, config.day_background_color);
    persist_write_int(APP_KEY_NIGHT_TEXT_COLOR, config.night_text_color);
    persist_write_int(APP_KEY_NIGHT_BACKGROUND_COLOR, config.night_background_color);
    persist_write_int(APP_KEY_SUNRISE, config.sunrise);
    persist_write_int(APP_KEY_SUNSET, config.sunset);
    persist_write_int(APP_KEY_SHOW_AM_PM, config.show_am_pm);
    persist_write_int(APP_KEY_HIDE_BATTERY, config.hide_battery);
    persist_write_int(APP_KEY_VIBRATE_BLUETOOTH, config.vibrate_bluetooth);
    persist_write_int(APP_KEY_CHARGING_ICON, config.charging_icon);
    persist_write_int(APP_KEY_BT_DISCONNECT_ICON, config.bt_disconnect_icon);
    persist_write_int(APP_KEY_BATTERY_PERCENT, config.battery_percent);
    persist_write_int(APP_KEY_LANGUAGE, config.language);
    persist_write_int(APP_KEY_LAYOUT, config.layout);
    persist_write_int(APP_KEY_AIR_QUALITY, config.air_quality);
    persist_write_int(APP_KEY_AQI_DEGREE, config.aqi_degree);
    persist_write_int(APP_KEY_HOURLY_VIBRATE, config.hourly_vibrate);
}
