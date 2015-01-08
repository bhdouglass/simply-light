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

function convertYahooTime(string) {
	string = string.toLowerCase();
	var time = string.replace('am', '').replace('pm', '').replace(' ', '');
	var split = string.split(':');
	var hours = parseInt(split[0]);
	var minutes = parseInt(split[1]);

	if (string.indexOf('pm') >= 0) {
		hours += 12;
	}

	return (hours * 60) + minutes;
}

function yahooWeather(pos) {
	var geo = '';
	/*if (config.location) {
		geo = 'select woeid from geo.places where text="' + config.location + '"';
	}
	else {*/
		geo = 'select woeid from geo.placefinder where text="' + pos.coords.latitude + ',' + pos.coords.longitude + '" and gflags="R"';
	//}

	var unit = 'c';
	if (config.temperature_units == 'imperial') {
		unit = 'f';
	}

	var select = 'select * from weather.forecast where woeid in (' + geo + ') and u="' + unit + '"';
	console.log(select);
	var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent(select);
	console.log(url);

	get(url, function(response) {
		var json = JSON.parse(response);
		var data = {};
		if (Array.isArray(json.query.results)) {
			data = json.query.results[0].channel;
		}
		else {
			data = json.query.results.channel;
		}

		var title = data.title;
		var temperature = Math.round(data.item.condition.temp);
		var condition = yahooConditionToOpenWeatherMap(data.item.condition.code);
		var sunrise = convertYahooTime(data.astronomy.sunrise);
		var sunset = convertYahooTime(data.astronomy.sunset);

		if (config.temperature_units == 'kelvin') {
			temperature += 273.15;
		}

		console.log('temp:    ' + temperature);
		console.log('cond:    ' + condition);
		console.log('title:   ' + title);
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

function openWeatherMapWeather(pos) {
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

function fetchWeatherHelper(pos) {
	if (config.weather_provider === 0) {
		openWeatherMapWeather(pos);
	}
	else {
		yahooWeather(pos);
	}
}

function fetchWeather() {
	console.log('fetching weather');

	if (config.location && config.weather_provider != 1) {
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
