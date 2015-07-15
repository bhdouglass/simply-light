#include <pebble.h>

#include "appinfo.h"
#include "weather.h"
#include "ui.h"
#include "config.h"

static void check_refresh() {
	bool refresh = false;
	if (ui.state.elapsed_time >= config.refresh_time && !ui.state.request_failed) {
		refresh = true;
	}
	else if (ui.state.elapsed_time >= config.wait_time && ui.state.request_failed) {
		refresh = true;
	}

	if (refresh) {
		ui.state.elapsed_time = 0;
		ui.state.request_failed = true;

		Tuplet value = TupletInteger(APP_KEY_FETCH_WEATHER, 1);
		DictionaryIterator *iter;
		app_message_outbox_begin(&iter);

		if (iter == NULL) {
			return;
		}

		dict_write_tuplet(iter, &value);
		dict_write_end(iter);
		app_message_outbox_send();
	}
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
			check_refresh();
		}
	}

	if (units_changed & DAY_UNIT) {
		strftime(ui.texts.date, sizeof(ui.texts.date), "%a %e", tick_time);
	}

	if (units_changed & MONTH_UNIT) {
		strftime(ui.texts.month, sizeof(ui.texts.month), "%B", tick_time);
	}

	strftime(ui.texts.am_pm, sizeof(ui.texts.am_pm), "%p", tick_time);
	ui_time_update();
	ui_colorize();
}

static void handle_bluetooth(bool connected) {
	ui.state.bt_connected = connected;

	//TODO
	if (ui.state.bt_connected) {
		//text_layer_set_font(condition_layer, font_weather);
		//set_condition(-999, is_day, condition_text);
		check_refresh();
	}
	else {
		if (config.vibrate_bluetooth == 1) {
			vibes_short_pulse();
		}

		//TODO
		if (config.bt_disconnect_icon) {
			/*int size = sizeof(condition_text);
			text_layer_set_font(condition_layer, font_icons);
			strncpy(condition_text, "\uf136", size);*/
		}
	}
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

	//TODO battery icon
	/*if (battery_state.is_charging) {
		if (charging_icon) {
			int size = sizeof(condition_text);
			text_layer_set_font(condition_layer, font_icons);
			strncpy(condition_text, "\uf12c", size);
		}
	}
	else {
		text_layer_set_font(condition_layer, font_weather);
		set_condition(condition, is_day, condition_text);
	}*/
}

static void msg_received_handler(DictionaryIterator *iter, void *context) {
	(void) context;

	Tuple *t = dict_read_first(iter);
	while(t != NULL) {
		int key = t->key;
		int value = t->value->int32;
		switch(key) {
			case APP_KEY_TEMPERATURE:
				ui.state.elapsed_time = 0;
				if (value == -999) {
					strncpy(ui.texts.temperature, " ", sizeof(ui.texts.temperature));
					ui.state.request_failed = true;
				}
				else {
					snprintf(ui.texts.temperature, sizeof(ui.texts.temperature), "%d\u00b0", value);
					ui.state.request_failed = false;
				}

				break;

			case APP_KEY_CONDITION:
				ui.state.condition = value;
				weather_set_condition(ui.state.condition, ui.state.is_day, ui.texts.condition);
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
				config.day_text_color = load_color(value);
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
		}

		t = dict_read_next(iter);
	}

	ui_weather_update();
	ui_time_update();
	ui_battery_update();
	ui_colorize();
	save_config();
}

static void init(void) {
	setlocale(LC_ALL, "");

	load_config();

	ui_init();

	time_t now = time(NULL);
	struct tm *tick_time = localtime(&now);
	handle_tick(tick_time, SECOND_UNIT | MINUTE_UNIT | HOUR_UNIT | DAY_UNIT | MONTH_UNIT);
	free(tick_time);

	tick_timer_service_subscribe(MINUTE_UNIT, handle_tick);
	battery_state_service_subscribe(&handle_battery);
	bluetooth_connection_service_subscribe(&handle_bluetooth);

	app_message_register_inbox_received(msg_received_handler);
	app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
}

static void deinit(void) {
	ui_deinit();

	tick_timer_service_unsubscribe();
	battery_state_service_unsubscribe();
	bluetooth_connection_service_unsubscribe();
}

int main(void) {
	init();
	app_event_loop();
	deinit();
}
