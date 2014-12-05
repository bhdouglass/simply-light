var config = {
	temperature_units: 'imperial',
	refresh_time: 30,
	wait_time: 1,
	location: '',
	color_invert: 0,
	night_auto_switch: 0,
};

var configInts = ['refresh_time', 'wait_time', 'color_invert', 'night_auto_switch'];

Pebble.addEventListener('ready', function(e) {
	console.log('starting js');

	loadConfig();
	console.log(JSON.stringify(config));
	fetchWeather();
});

Pebble.addEventListener('appmessage', function(e) {
	console.log('Received message: ' + JSON.stringify(e));
	if (e.payload.fetch_weather) {
		fetchWeather();
	}
});

Pebble.addEventListener('showConfiguration', function(e) {
	var url = 'http://bhdouglass.com/pebble/simply-light-config.html?version=' + appinfo.versionCode + '#' + encodeURIComponent(JSON.stringify(config));
	Pebble.openURL(url);
	console.log(url);
});

Pebble.addEventListener('webviewclosed', function(e) {
	if (e.response == 'cancel') {
		console.log('config canceled');
	}
	else {
		config = JSON.parse(decodeURIComponent(e.response));
		console.log(JSON.stringify(config));

		saveConfig();
		fetchWeather();
	}
});

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

function get(url, callback, errCallback) {
	var req = new XMLHttpRequest();
	req.open('GET', url);

	if (callback) {
		req.onload = function(e) {
			if (req.readyState === 4) {
				if (req.status == 200) {
					callback(req.responseText);
				}
				else if (errCallback) {
					errCallback(req);
				}
			}
		};
	}

	if (errCallback) {
		req.onerror = function(e) {
			errCallback(req);
		};
	}

	req.send();
	return req;
}

function fetchLocation(callback, errCallback) {
	console.log('fetching location');
	window.navigator.geolocation.getCurrentPosition(function(pos) { //Success
		console.log('lat: ' + pos.coords.latitude);
		console.log('lng: ' + pos.coords.longitude);

		callback(pos);

	}, function(err) { //Error
		console.warn('location error: ' + err.code + ' - ' + err.message);
		if (errCallback) {
			errCallback(err);
		}

	}, { //Options
		timeout: 15000,
		maximumAge: 60000
	});
}

function fetchWeatherHelper(pos) {
	var url = 'http://api.openweathermap.org/data/2.5/weather?';
	if (config.location) {
		url += 'q=' + config.location;
	}
	else {
		url += 'lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude;
	}

	if (config.temperature_units) {
		url += '&units=' + config.temperature_units;
	}

	console.log(url);
	get(url, function(response) { //Success
		var json = JSON.parse(response);

		var temperature = Math.round(json.main.temp);
		var location = json.name;
		var condition = json.weather[0].id; //TODO check if more conditions
		var sunrise = json.sys.sunrise;
		var sunset = json.sys.sunset;

		console.log('temp: ' + temperature);
		console.log('cond: ' + condition + ' - ' + json.weather.length);
		console.log('loc:  ' + location);

		Pebble.sendAppMessage({
			temperature: temperature,
			condition: condition,
			sunrise: sunrise,
			sunset: sunset
		});

	}, function(err) { //Error
		console.warn('Error while getting weather: ' + err.status);

		Pebble.sendAppMessage({
			temperature: -999,
			condition: -999,
		});
	});
}

function fetchWeather() {
	console.log('fetching weather');

	if (config.location) {
		fetchWeatherHelper();
	}
	else {
		fetchLocation(fetchWeatherHelper, function(err) {
			Pebble.sendAppMessage({
				temperature: -999,
				condition: -999,
			});
		});
	}
}
