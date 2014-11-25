var config = {
	temperature_units: 'imperial',
	refresh_time: 60,
	wait_time: 1,
	location: '',
};

Pebble.addEventListener('ready', function(e) {
	console.log('starting js');

	loadConfig();
	console.log(JSON.stringify(config));
	fetchWeather();
});

Pebble.addEventListener('appmessage', function(e) {
	console.log('Received message: ' + JSON.stringify(e));
});

Pebble.addEventListener('showConfiguration', function(e) {
	Pebble.openURL('http://bhdouglass.com/pebble/simply-light-config.html#' + encodeURIComponent(JSON.stringify(config)));
	console.log('http://bhdouglass.com/pebble/simply-light-config.html#' + encodeURIComponent(JSON.stringify(config)));
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
	for (key in config) {
		var value = window.localStorage.getItem(key);
		if (value !== null) {
			config[key] = value;
		}
	}
}

function saveConfig() {
	for (key in config) {
		window.localStorage.setItem(key, config[key]);
	}
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
		}
	}

	if (errCallback) {
		req.onerror = function(e) {
			errCallback(req);
		}
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

		console.log('temp: ' + temperature);
		console.log('cond: ' + condition + ' - ' + json.weather.length);
		console.log('loc:  ' + location);

		Pebble.sendAppMessage({
			temperature: temperature, //TODO: kelvin in watch app is too big
			condition: condition,
			//TODO: send back day/night based on sunrise/sunset
		});

		setTimeout(fetchWeather, 60000 * config.refresh_time); //TODO: make watch send timer update

	}, function(err) { //Error
		console.warn('Error while getting weather: ' + err.status);

		Pebble.sendAppMessage({
			temperature: -999,
			condition: 0,
		});

		setTimeout(fetchWeather, 60000 * config.wait_time);
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
				condition: 0,
			});

			setTimeout(fetchWeather, 60000 * config.wait_time);
		});
	}
}
