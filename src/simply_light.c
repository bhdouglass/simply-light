#include <pebble.h>

#include "appinfo.h"
#include "weather.h"

#define PWIDTH 144
#define HALFPWIDTH 72
#define PHEIGHT 168
#define CHARGEUNIT 1.44

static char date_text[7];
static char time_text[6];
static char month_text[10];
static char temperature_text[6];
static char condition_text[5];
static char am_pm_text[3];

int top = 5;

static Window *window;
static Layer *window_layer;
static Layer *battery_layer;
static TextLayer *date_layer;
static TextLayer *time_layer;
static TextLayer *month_layer;
static TextLayer *temperature_layer;
static TextLayer *condition_layer;
static TextLayer *am_pm_layer;

GFont font_date;
GFont font_time;
GFont font_month;
GFont font_weather;
GFont font_am_pm;

BatteryChargeState battery_state;

static AppTimer *timer;
int refresh_time = 30;
int wait_time = 1;
int show_am_pm = 0;

int invert = 0;
int night_auto_switch = 0;
GColor text_color = GColorBlack;
GColor background_color = GColorWhite;

int condition = -999;
int sunrise = -1;
int sunset = -1;
int is_day = -1;

static void update_battery_layer(Layer *layer, GContext *ctx) {
	int width = battery_state.charge_percent * CHARGEUNIT;
	int offset = (PWIDTH - width) / 2;
	//char log[] = "xxx xxx";
	//snprintf(log, sizeof(log), "%d %d", width, offset);
	//APP_LOG(APP_LOG_LEVEL_DEBUG, log);

	graphics_context_set_fill_color(ctx, text_color);
	graphics_fill_rect(ctx, GRect(offset, 29, width, 4), 0, GCornerNone);
}

static void handle_battery(BatteryChargeState charge_state) {
	battery_state = charge_state;
	layer_mark_dirty(battery_layer);
}

static void colorize() {
	if (night_auto_switch == 0) {
		if (invert == 1) {
			text_color = GColorWhite;
			background_color = GColorBlack;
		}
		else {
			text_color = GColorBlack;
			background_color = GColorWhite;
		}
	}
	else {
		if (is_day == 1 && invert == 0) {
			text_color = GColorBlack;
			background_color = GColorWhite;
		}
		else if (is_day == 1 && invert == 1) {
			text_color = GColorWhite;
			background_color = GColorBlack;
		}
		else if (is_day == 0 && invert == 0) {
			text_color = GColorWhite;
			background_color = GColorBlack;
		}
		else if (is_day == 0 && invert == 1) {
			text_color = GColorBlack;
			background_color = GColorWhite;
		}
	}

	window_set_background_color(window, background_color);
	text_layer_set_text_color(time_layer, text_color);
	layer_mark_dirty(battery_layer);
	text_layer_set_text_color(date_layer, text_color);
	text_layer_set_text_color(month_layer, text_color);
	text_layer_set_text_color(temperature_layer, text_color);
	text_layer_set_text_color(condition_layer, text_color);
}

static void set_day_night() {
	int old_is_day = is_day;
	if (sunrise > 0 && sunset > 0) {
		time_t now = time(NULL);
		struct tm *local = localtime(&now);
		int minutes = local->tm_hour * 60 + local->tm_min;

		if (sunrise <= minutes && minutes < sunset) {
			is_day = 1;
		}
		else {
			is_day = 0;
		}
	}
	else {
		is_day = -1;
	}

	if (old_is_day != is_day) {
		set_condition(condition, is_day, condition_text);
		colorize();
	}
}

static void set_am_pm() {
	if (show_am_pm == 1 && !clock_is_24h_style()) {
		time_t now = time(NULL);
		struct tm *local = localtime(&now);

		layer_set_hidden((Layer *)am_pm_layer, false);
		strftime(am_pm_text, sizeof(am_pm_text), "%p", local);
		text_layer_set_text(am_pm_layer, am_pm_text);

		char time_string[5];
		strftime(time_string, sizeof(time_string), "%I:%M", local);

		if (time_string[0] == '0') {
			layer_set_frame((Layer *)am_pm_layer, GRect(-13, top, PWIDTH, 20));
		}
		else {
			layer_set_frame((Layer *)am_pm_layer, GRect(0, top, PWIDTH, 20));
		}
	}
	else {
		layer_set_hidden((Layer *)am_pm_layer, true);
	}
}

static void handle_tick(struct tm *tick_time, TimeUnits units_changed) {
	if (units_changed & MINUTE_UNIT) {
		strftime(time_text, sizeof(time_text),
			clock_is_24h_style() ? "%H:%M" : "%I:%M", tick_time);

		if (time_text[0] == '0') {
			memmove(time_text, &time_text[1], sizeof(time_text) - 1);
		}

		text_layer_set_text(time_layer, time_text);

		set_am_pm();
	}

	if (units_changed & DAY_UNIT) {
		strftime(date_text, sizeof(date_text), "%a %e", tick_time);
		text_layer_set_text(date_layer, date_text);
	}

	if (units_changed & MONTH_UNIT) {
		strftime(month_text, sizeof(month_text), "%B", tick_time);
		text_layer_set_text(month_layer, month_text);
	}

	set_day_night();
}

static void handle_timer(void *data) {
	Tuplet value = TupletInteger(APP_KEY_FETCH_WEATHER, 1);

	DictionaryIterator *iter;
	app_message_outbox_begin(&iter);

	if (iter == NULL) {
		return;
	}

	dict_write_tuplet(iter, &value);
	dict_write_end(iter);
	app_message_outbox_send();

	timer = app_timer_register(refresh_time * 60000, handle_timer, NULL);
}

static void msg_received_handler(DictionaryIterator *iter, void *context) {
	(void) context;

	Tuple *t = dict_read_first(iter);
	while(t != NULL) {
		int key = t->key;
		int value = t->value->int32;
		switch(key) {
			case APP_KEY_TEMPERATURE:
				if (value == -999) {
					/*sunrise = -1;
					persist_write_int(APP_KEY_SUNRISE, sunrise);

					sunset = -1;
					persist_write_int(APP_KEY_SUNSET, sunset);*/

					strncpy(temperature_text, " ", sizeof(temperature_text));

					app_timer_cancel(timer);
					timer = app_timer_register(wait_time * 60000, handle_timer, NULL);
				}
				else {
					snprintf(temperature_text, sizeof(temperature_text), "%d\u00b0", value);
				}
				text_layer_set_text(temperature_layer, temperature_text);

				break;

			case APP_KEY_CONDITION:
				condition = value;

				if (value == -999) {
					/*sunrise = -1;
					persist_write_int(APP_KEY_SUNRISE, sunrise);

					sunset = -1;
					persist_write_int(APP_KEY_SUNSET, sunset);*/

					app_timer_cancel(timer);
					timer = app_timer_register(wait_time * 60000, handle_timer, NULL);
				}

				break;

			case APP_KEY_REFRESH_TIME:
				refresh_time = value;

				app_timer_cancel(timer);
				timer = app_timer_register(refresh_time * 60000, handle_timer, NULL);

				break;

			case APP_KEY_WAIT_TIME:
				wait_time = value;

				break;

			case APP_KEY_COLOR_INVERT:
				invert = value;
				persist_write_int(APP_KEY_COLOR_INVERT, invert);

				break;

			case APP_KEY_NIGHT_AUTO_SWITCH:
				night_auto_switch = value;
				persist_write_int(APP_KEY_NIGHT_AUTO_SWITCH, night_auto_switch);

			case APP_KEY_SUNRISE:
				sunrise = value;
				persist_write_int(APP_KEY_SUNRISE, sunrise);
				break;

			case APP_KEY_SUNSET:
				sunset = value;
				persist_write_int(APP_KEY_SUNSET, sunset);
				break;

			case APP_KEY_SHOW_AM_PM:
				show_am_pm = value;
				persist_write_int(APP_KEY_SHOW_AM_PM, show_am_pm);
				set_am_pm();
				break;
		}

		t = dict_read_next(iter);
	}

	set_day_night();
	colorize();
	set_condition(condition, is_day, condition_text);
	text_layer_set_text(condition_layer, condition_text);
}

static void window_load(Window *window) {
	window_layer = window_get_root_layer(window);

	font_time = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_BOLD_50));
	font_date = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_32));
	font_month = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_MONO_20));
	font_weather = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_WEATHER_30));
	font_am_pm = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_DROIDSANS_MONO_16));

	time_layer = text_layer_create(GRect(0, top, PWIDTH, 100));
	text_layer_set_background_color(time_layer, GColorClear);
	text_layer_set_font(time_layer, font_time);
	text_layer_set_text_alignment(time_layer, GTextAlignmentCenter);
	layer_add_child(window_layer, text_layer_get_layer(time_layer));

	battery_layer = layer_create(GRect(0, top + 29, PWIDTH, 100));
	layer_set_update_proc(battery_layer, update_battery_layer);
	layer_add_child(window_layer, battery_layer);

	date_layer = text_layer_create(GRect(0, top + 60, PWIDTH, 100));
	text_layer_set_background_color(date_layer, GColorClear);
	text_layer_set_font(date_layer, font_date);
	text_layer_set_text_alignment(date_layer, GTextAlignmentCenter);
	layer_add_child(window_layer, text_layer_get_layer(date_layer));

	month_layer = text_layer_create(GRect(0, top + 96, PWIDTH, 28));
	text_layer_set_background_color(month_layer, GColorClear);
	text_layer_set_font(month_layer, font_month);
	text_layer_set_text_alignment(month_layer, GTextAlignmentCenter);
	layer_add_child(window_layer, text_layer_get_layer(month_layer));

	temperature_layer = text_layer_create(GRect(0, top + 120, HALFPWIDTH, 50));
	text_layer_set_background_color(temperature_layer, GColorClear);
	text_layer_set_font(temperature_layer, font_date);
	text_layer_set_text_alignment(temperature_layer, GTextAlignmentCenter);
	layer_add_child(window_layer, text_layer_get_layer(temperature_layer));

	condition_layer = text_layer_create(GRect(HALFPWIDTH + 1, top + 121, HALFPWIDTH, 50));
	text_layer_set_background_color(condition_layer, GColorClear);
	text_layer_set_font(condition_layer, font_weather);
	text_layer_set_text_alignment(condition_layer, GTextAlignmentCenter);
	layer_add_child(window_layer, text_layer_get_layer(condition_layer));

	am_pm_layer = text_layer_create(GRect(0, top, PWIDTH, 20));
	text_layer_set_background_color(am_pm_layer, GColorClear);
	text_layer_set_font(am_pm_layer, font_am_pm);
	text_layer_set_text_alignment(am_pm_layer, GTextAlignmentCenter);
	layer_add_child(window_layer, text_layer_get_layer(am_pm_layer));

	set_day_night();
	colorize();
	set_condition(-999, is_day, condition_text);
	text_layer_set_text(condition_layer, condition_text);
	set_am_pm();
}

static void window_unload(Window *window) {
	text_layer_destroy(time_layer);
	layer_destroy(battery_layer);
	text_layer_destroy(date_layer);
	text_layer_destroy(month_layer);
	text_layer_destroy(temperature_layer);
	text_layer_destroy(condition_layer);
	text_layer_destroy(am_pm_layer);
}

static void load_config(void) {
	if (persist_exists(APP_KEY_COLOR_INVERT)) {
		invert = persist_read_int(APP_KEY_COLOR_INVERT);
	}

	if (persist_exists(APP_KEY_NIGHT_AUTO_SWITCH)) {
		night_auto_switch = persist_read_int(APP_KEY_NIGHT_AUTO_SWITCH);
	}

	if (persist_exists(APP_KEY_SUNRISE)) {
		sunrise = persist_read_int(APP_KEY_SUNRISE);
	}

	if (persist_exists(APP_KEY_SUNSET)) {
		sunset = persist_read_int(APP_KEY_SUNSET);
	}

	if (persist_exists(APP_KEY_SHOW_AM_PM)) {
		show_am_pm = persist_read_int(APP_KEY_SHOW_AM_PM);
	}
}

static void init(void) {
	load_config();

	window = window_create();
	battery_state = battery_state_service_peek();

	window_set_window_handlers(window, (WindowHandlers) {
		.load = window_load,
		.unload = window_unload,
	});

	const bool animated = true;
	window_stack_push(window, animated);

	time_t now = time(NULL);
	struct tm *local = localtime(&now);
	handle_tick(local, SECOND_UNIT | MINUTE_UNIT | HOUR_UNIT | DAY_UNIT | MONTH_UNIT);
	free(local);

	tick_timer_service_subscribe(MINUTE_UNIT, handle_tick);
	battery_state_service_subscribe(&handle_battery);

	app_message_register_inbox_received(msg_received_handler);
	app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());

	timer = app_timer_register(wait_time * 60000, handle_timer, NULL);
}

static void deinit(void) {
	window_destroy(window);
	tick_timer_service_unsubscribe();
	battery_state_service_unsubscribe();

	fonts_unload_custom_font(font_time);
	fonts_unload_custom_font(font_date);
	fonts_unload_custom_font(font_month);
	fonts_unload_custom_font(font_weather);
	fonts_unload_custom_font(font_am_pm);

	app_timer_cancel(timer);
}

int main(void) {
	init();
	app_event_loop();
	deinit();
}
