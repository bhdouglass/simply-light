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
            label: 'Normal',
            value: 0
        }, {
            label: 'Wind Chill',
            value: 1
        }, {
            label: 'Heat Index',
            value: 2
        }
    ];

    $scope.battery_percent = [
        {
            label: 'Hide',
            value: 0
        }, {
            label: 'Top Right Corner',
            value: 1
        }, {
            label: 'Top Left Corner',
            value: 2
        }
    ];

    $scope.language = [
        {
            label: 'Pebble\'s Settings',
            value: 0
        }, {
            label: 'Bahasa Malaysia',
            value: 2
        }, {
            label: 'Hungarian',
            value: 1
        }
    ];

    $scope.layout = [
        {
            label: 'Standard',
            value: 0
        }, {
            label: 'Reverse',
            value: 1
        }
    ];

    $scope.config_ints = ['refresh_time', 'wait_time'];
    $scope.config_bools = [
        'air_quality', 'show_am_pm', 'hide_battery', 'charging_icon',
        'bt_disconnect_icon', 'vibrate_bluetooth', 'aqi_degree',
    ];

    $scope.config = {
        temperature_units: 'imperial',
        refresh_time: 30,
        wait_time: 1,
        location: '',
        show_am_pm: false,
        hide_battery: false,
        weather_provider: 0,
        feels_like: 0,
        vibrate_bluetooth: false,
        charging_icon: true,
        bt_disconnect_icon: false,
        battery_percent: 0,
        day_text_color: 0,
        day_background_color: 1,
        night_text_color: 0,
        night_background_color: 1,
        language: 0,
        layout: 0,
        air_quality: false,
        last_aqi_location: null,
        aqi_degree: false,
        air_quality_location: '',
    };

    $scope.errors = {
        refresh_time: false,
        wait_time: false,
        location: false,
    };

    function validateInt(value, error) {
        if (parseInt(value) === value && parseInt(value) > 0 && value !== null && value !== undefined) {
            value = parseInt(value);

            if (error) {
                $scope.errors[error] = false;
            }
        }
        else {
            value = 1;

            if (error) {
                $scope.errors[error] = true;
            }
        }

        return value;
    }

    angular.forEach($scope.config_ints, function(name) {
        $scope.$watch('config.' + name, function() {
            $scope.errors[name] = false;
            validateInt($scope.config[name], name);
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
            var config = angular.copy($scope.config);
            angular.forEach($scope.config_bools, function(key) {
                config[key] = config[key] ? 1 : 0;
            });

            delete config.last_aqi_location;

            console.log(config);
            window.location.href = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(config));
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
                    else if ($scope.config_bools.indexOf(key) >= 0) {
                        $scope.config[key] = !!value;
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
