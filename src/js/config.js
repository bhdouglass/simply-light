var config = {
	temperature_units: 'imperial',
	refresh_time: 30,
	wait_time: 1,
	location: '',
	color_invert: 0,
	night_auto_switch: 0,
};

var configInts = ['refresh_time', 'wait_time', 'color_invert', 'night_auto_switch'];

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

	Pebble.sendAppMessage({
		refresh_time: config.refresh_time,
		wait_time: config.wait_time,
		color_invert: config.color_invert,
		night_auto_switch: config.night_auto_switch,
	});
}

function saveConfig() {
	for (var key in config) {
		window.localStorage.setItem(key, config[key]);
	}

	Pebble.sendAppMessage({
		refresh_time: config.refresh_time,
		wait_time: config.wait_time,
		color_invert: config.color_invert,
		night_auto_switch: config.night_auto_switch,
	});
}
