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
	var request = new Http.Get(url, true);
	request.start().then(function(response) {
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

	}).fail(function(err, errCode) {
		console.warn('Error while getting weather: ' + errCode);

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
