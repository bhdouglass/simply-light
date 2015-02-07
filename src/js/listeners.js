Pebble.addEventListener('ready', function(e) {
	console.log('starting js, v' + appinfo.versionCode);

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
	var url = 'http://simply-light.bhdouglass.com/?version=' + appinfo.versionCode + '#' + encodeURIComponent(JSON.stringify(config));
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
