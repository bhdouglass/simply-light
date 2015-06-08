var config = {
	temperature_units: 'imperial',
	refresh_time: 30,
	wait_time: 1,
	location: '',
	color_invert: 0,
	night_auto_switch: 0,
	show_am_pm: 0,
	hide_battery: 0,
	weather_provider: 0,
	feels_like: 0,
	vibrate_bluetooth: 0,
	charging_icon: 1,
	bt_disconnect_icon: 0,
};

var configInts = [
	'refresh_time', 'wait_time', 'color_invert', 'night_auto_switch', 'show_am_pm',
	'hide_battery', 'weather_provider', 'feels_like', 'vibrate_bluetooth',
	'charging_icon', 'bt_disconnect_icon'
];

function ack(e) {
	console.log('Successfully delivered message with transactionId=' + e.data.transactionId);
}

function nack(e) {
	console.log('Unable to deliver message with transactionId=' + e.data.transactionId + ', error is: ' + e.error.message);
}

function loadConfig() {
	for (var key in config) {
		var value = window.localStorage.getItem(key);
		if (value !== null) {
			if (configInts.indexOf(key) >= 0) {
				config[key] = parseInt(value);
			}
			else {
				config[key] = value;
			}
		}
	}

	MessageQueue.sendAppMessage({
		refresh_time: config.refresh_time,
		wait_time: config.wait_time,
		color_invert: config.color_invert,
		night_auto_switch: config.night_auto_switch,
		show_am_pm: config.show_am_pm,
		hide_battery: config.hide_battery,
		vibrate_bluetooth: config.vibrate_bluetooth,
		charging_icon: config.charging_icon,
		bt_disconnect_icon: config.bt_disconnect_icon,
	}, ack, nack);
}

function saveConfig() {
	for (var key in config) {
		window.localStorage.setItem(key, config[key]);
	}

	MessageQueue.sendAppMessage({
		refresh_time: config.refresh_time,
		wait_time: config.wait_time,
		color_invert: config.color_invert,
		night_auto_switch: config.night_auto_switch,
		show_am_pm: config.show_am_pm,
		hide_battery: config.hide_battery,
		vibrate_bluetooth: config.vibrate_bluetooth,
		charging_icon: config.charging_icon,
		bt_disconnect_icon: config.bt_disconnect_icon,
	}, ack, nack);
}
