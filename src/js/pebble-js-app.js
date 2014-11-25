//TODO make these configurable
var temperature_units = 'imperial'; //imperial or metric
var fetch_time = 60;
var wait_time = 1;

Pebble.addEventListener('ready', function(e) {
	console.log('starting js');

	fetchWeather();
});

Pebble.addEventListener('appmessage', function(e) {
	console.log('Received message: ' + JSON.stringify(e));
});

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

function fetchWeather() {
	console.log('fetching weather');

	window.navigator.geolocation.getCurrentPosition(function(pos) { //Success
		console.log('lat: ' + pos.coords.latitude);
		console.log('lng: ' + pos.coords.longitude);

		//TODO: allow for configured location
		get('http://api.openweathermap.org/data/2.5/weather?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&units=' + temperature_units, function(response) { //Success
			var json = JSON.parse(response);

			var temperature = Math.round(json.main.temp);
			var location = json.name;
			var condition = json.weather[0].id; //TODO check if more conditions

			console.log('temp: ' + temperature);
			console.log('cond: ' + condition);
			console.log('loc:  ' + location);

			Pebble.sendAppMessage({
				temperature: temperature,
				condition: condition,
			});

			setTimeout(fetchWeather, 60000 * fetch_time);

		}, function(err) { //Error
			console.warn('Error while getting weather: ' + err.status);

			Pebble.sendAppMessage({
				temperature: -999,
				condition: 0,
			});

			setTimeout(fetchWeather, 60000 * wait_time);
		});

	}, function(err) { //Error
		console.warn('location error: ' + err.code + ' - ' + err.message);

		Pebble.sendAppMessage({
			temperature: -999,
			condition: 0,
		});

		setTimeout(fetchWeather, 60000 * wait_time);

	}, { //Options
		timeout: 15000,
		maximumAge: 60000
	});
};
