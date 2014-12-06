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
	get(url, function(response) {
		var json = JSON.parse(response);

		var temperature = Math.round(json.main.temp);
		var location = json.name;
		var condition = json.weather[0].id; //TODO check if more conditions

		var sunrise_date = new Date(json.sys.sunrise * 1000);
		var sunset_date = new Date(json.sys.sunset * 1000);
		var sunrise = sunrise_date.getHours() * 60 + sunrise_date.getMinutes();
		var sunset = sunset_date.getHours() * 60 + sunset_date.getMinutes();

		console.log('temp:    ' + temperature);
		console.log('cond:    ' + condition + ' - ' + json.weather.length);
		console.log('loc:     ' + location);
		console.log('sunrise: ' + sunrise);
		console.log('sunset:  ' + sunset);

		Pebble.sendAppMessage({
			temperature: temperature,
			condition: condition,
			sunrise: sunrise,
			sunset: sunset
		});

	}, function(err) {
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
