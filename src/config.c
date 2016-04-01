#include <pebble.h>

#include "appinfo.h"
#include "config.h"

void load_config() {
    config.sunrise = -1;
    config.sunset = -1;
    config.refresh_time = 30;
    config.wait_time = 1;
    config.hide_battery = 0;
    config.vibrate_bluetooth = 0;
    config.day_text_color = 0;
    config.day_background_color = 1;
    config.night_text_color = 0;
    config.night_background_color = 1;
    config.language = 0;
    config.layout = 0;
    config.air_quality = 0;
    config.hourly_vibrate = 0;
    config.show_status_bar = 1;
    config.status_bar_color = 0;
    config.status_bar_text_color = 1;
    config.status_bar1 = STATUS_BAR_EMPTY;
    config.status_bar2 = STATUS_BAR_EMPTY;
    config.status_bar3 = STATUS_BAR_EMPTY;

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

    if (persist_exists(APP_KEY_HIDE_BATTERY)) {
        config.hide_battery = persist_read_int(APP_KEY_HIDE_BATTERY);
    }

    if (persist_exists(APP_KEY_VIBRATE_BLUETOOTH)) {
        config.vibrate_bluetooth = persist_read_int(APP_KEY_VIBRATE_BLUETOOTH);
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

    if (persist_exists(APP_KEY_HOURLY_VIBRATE)) {
        config.hourly_vibrate = persist_read_int(APP_KEY_HOURLY_VIBRATE);
    }

    if (persist_exists(APP_KEY_SHOW_STATUS_BAR)) {
        config.show_status_bar = persist_read_int(APP_KEY_SHOW_STATUS_BAR);
    }

    if (persist_exists(APP_KEY_STATUS_BAR_COLOR)) {
        config.status_bar_color = persist_read_int(APP_KEY_STATUS_BAR_COLOR);
    }

    if (persist_exists(APP_KEY_STATUS_BAR_TEXT_COLOR)) {
        config.status_bar_text_color = persist_read_int(APP_KEY_STATUS_BAR_TEXT_COLOR);
    }

    if (persist_exists(APP_KEY_STATUS_BAR1)) {
        config.status_bar1 = persist_read_int(APP_KEY_STATUS_BAR1);
    }

    if (persist_exists(APP_KEY_STATUS_BAR2)) {
        config.status_bar2 = persist_read_int(APP_KEY_STATUS_BAR2);
    }

    if (persist_exists(APP_KEY_STATUS_BAR3)) {
        config.status_bar3 = persist_read_int(APP_KEY_STATUS_BAR3);
    }
}

void save_config() {
    persist_write_int(APP_KEY_DAY_TEXT_COLOR, config.day_text_color);
    persist_write_int(APP_KEY_DAY_BACKGROUND_COLOR, config.day_background_color);
    persist_write_int(APP_KEY_NIGHT_TEXT_COLOR, config.night_text_color);
    persist_write_int(APP_KEY_NIGHT_BACKGROUND_COLOR, config.night_background_color);
    persist_write_int(APP_KEY_SUNRISE, config.sunrise);
    persist_write_int(APP_KEY_SUNSET, config.sunset);
    persist_write_int(APP_KEY_HIDE_BATTERY, config.hide_battery);
    persist_write_int(APP_KEY_VIBRATE_BLUETOOTH, config.vibrate_bluetooth);
    persist_write_int(APP_KEY_LANGUAGE, config.language);
    persist_write_int(APP_KEY_LAYOUT, config.layout);
    persist_write_int(APP_KEY_AIR_QUALITY, config.air_quality);
    persist_write_int(APP_KEY_HOURLY_VIBRATE, config.hourly_vibrate);
    persist_write_int(APP_KEY_SHOW_STATUS_BAR, config.show_status_bar);
    persist_write_int(APP_KEY_STATUS_BAR_COLOR, config.status_bar_color);
    persist_write_int(APP_KEY_STATUS_BAR_TEXT_COLOR, config.status_bar_text_color);
    persist_write_int(APP_KEY_STATUS_BAR1, config.status_bar1);
    persist_write_int(APP_KEY_STATUS_BAR2, config.status_bar2);
    persist_write_int(APP_KEY_STATUS_BAR3, config.status_bar3);
}
