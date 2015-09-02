'use strict';

angular.module('app').controller('indexCtrl', function($scope, $http, $location, $timeout) {
	$scope.saving = false;
	$scope.version = 1.1;
	$scope.latestVersion = '<%= version %>';
	$scope.temperature_units = [
		{
			label: 'Fahrenheit',
			value: 'imperial'
		}, {
			label: 'Celsius',
			value: 'metric'
		}, {
			label: 'Kelvin',
			value: ''
		}
	];

	$scope.color_invert = [
		{
			label: 'White Background with Black Text',
			value: 0
		}, {
			label: 'Black Background with White Text',
			value: 1
		}
	];

	$scope.night_auto_switch = [
		{
			label: 'Do no automatically invert colors',
			value: 0
		}, {
			label: 'Automatically invert colors at night',
			value: 1
		}
	];

	$scope.show_am_pm = [
		{
			label: 'Do not show AM/PM',
			value: 0
		}, {
			label: 'Show AM/PM',
			value: 1
		}
	];

	$scope.hide_battery = [
		{
			label: 'Show battery status line',
			value: 0
		}, {
			label: 'Hide battery status line',
			value: 1
		}
	];

	$scope.weather_provider = [
		{
			label: 'OpenWeatherMap',
			value: 0
		}, {
			label: 'Yahoo Weather',
			value: 1
		}
	];

	$scope.feels_like = [
		{
			label: 'Normal Temperature',
			value: 0
		}, {
			label: 'Wind Chill',
			value: 1
		}, {
			label: 'Heat Index',
			value: 2
		}
	];

	$scope.vibrate_bluetooth = [
		{
			label: 'Don\'t vibrate on bluetooth disconnect',
			value: 0
		}, {
			label: 'Vibrate on bluetooth disconnect',
			value: 1
		}
	];

	$scope.charging_icon = [
		{
			label: 'Don\'t show charging icon',
			value: 0
		}, {
			label: 'Show icon when charging',
			value: 1
		}
	];

	$scope.bt_disconnect_icon = [
		{
			label: 'Don\'t show bluetooth disconnected icon',
			value: 0
		}, {
			label: 'Show icon when bluetooth disconnected',
			value: 1
		}
	];

	$scope.battery_percent = [
		{
			label: 'Don\'t show battery percent',
			value: 0
		}, {
			label: 'Show battery percent in top right corner',
			value: 1
		}, {
			label: 'Show battery percent in top left corner',
			value: 2
		}
	];

	$scope.language = [
		{
			label: 'Use Pebble\'s language settings',
			value: 0
		}, {
			label: 'Hungarian',
			value: 1
		}
	];

	$scope.layout = [
		{
			label: 'Time, Battery Bar, Date, Month, Weather',
			value: 0
		}, {
			label: 'Weather, Month, Date, Battery Bar, Time',
			value: 1
		}
	];

	$scope.config_ints = ['refresh_time', 'wait_time'];

	$scope.config = {
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
		battery_percent: 0,
		day_text_color: 0,
		day_background_color: 1,
		night_text_color: 0,
		night_background_color: 1,
		language: 0,
		layout: 0,
	};

	$scope.errors = {
		refresh_time: false,
		wait_time: false,
		location: false,
	};

	function validateInt(value, error) {
		if (parseInt(value) === value && parseInt(value) > 0) {
			error = false;
			value = parseInt(value);
		}
		else {
			value = 1;
			error = true;
		}

		return value;
	}

	angular.forEach($scope.config_ints, function(name) {
		$scope.$watch('config.' + name, function() {
			validateInt($scope.config[name], $scope.errors[name]);
		});
	});

	$scope.cancel = function() {
		if ($scope.saving) {
			return;
		}

		window.location.href = 'pebblejs://close#cancel';
	};

	$scope.save = function() {
		if ($scope.saving) {
			return;
		}

		$scope.saving = true;

		var error = false;
		angular.forEach($scope.errors, function(err) {
			if (err) {
				error = true;
			}
		});

		$scope.saving = false;
		if (!error) {
			console.log($scope.config);
			window.location.href = 'pebblejs://close#' + encodeURIComponent(JSON.stringify($scope.config));
		}
	};

	$timeout(function() {
		var hash = $location.hash();
		if (hash) {
			var config = JSON.parse(decodeURIComponent(hash));
			console.log(config);

			angular.forEach(config, function(value, key) {
				if ($scope.config[key] !== undefined) {
					if ($scope.config_ints.indexOf(key) >= 0) {
						$scope.config[key] = validateInt(value);
					}
					else {
						$scope.config[key] = value;
					}
				}
			});
			console.log($scope.config);
		}

		var query = $location.search();
		if (query.version) {
			$scope.version = parseFloat(query.version);
		}

		console.log('version: ' + $scope.version);
		console.log('lastest version: ' + $scope.latestVersion);
	});
});
