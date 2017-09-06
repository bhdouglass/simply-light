'use strict';

angular.module('app').controller('indexCtrl', function($scope, $http, $location, $timeout) {
    $scope.loaded = false;
    $scope.saving = false;
    $scope.version = 1.1;
    $scope.latestVersion = '<%= version %>';
    $scope.platform = 'aplite';
    $scope.debug = {
        config: null,
        version: null,
        datalog: '',
        last_status_code: -1,
        last_location_error_code: -1,
        platform: '',
    };
    var originalLocation = '';
    $scope.locationError = null;
    $scope.config = {};
    $scope.master_key_data = {};
    $scope.saving = false;

    $scope.$watch('master_key_data', function() {
        if ($scope.master_key_data && $scope.master_key_data.weather) {
            if ($scope.master_key_data.weather.owm) {
                $scope.config.openweathermap_api_key = $scope.master_key_data.weather.owm;
            }

            if ($scope.master_key_data.weather.forecast) {
                $scope.config.forecastio_api_key = $scope.master_key_data.weather.forecast;
            }

            if ($scope.master_key_data.weather.wu) {
                $scope.config.weather_underground_api_key = $scope.master_key_data.weather.wu;
            }
        }
    }, true);

    //Load enums into the scope
    $scope.constants = {};
    for (var name in configuration_meta.enums) {
        var e = configuration_meta.enums[name];
        $scope.constants[name] = {};

        var enum_ = [];
        for (var key in e) {
            var constant_key = key
                .replace(/-/g, '')
                .replace(/'/g, '')
                .replace(/\./g, '')
                .replace(/\//g, '')
                .replace(/\s\s+/g, ' ')
                .trim()
                .replace(/ /g, '_')
                .toUpperCase();
            $scope.constants[name][constant_key] = e[key];

            var label = key;
            if (label == 'Forecast.io' && name == 'weather_provider') {
                //Hack to not break the auto generation code
                label = 'Dark Sky / Forecast.io';
            }

            enum_.push({
                label: label,
                value: e[key],
            });
        }

        $scope[name] = enum_;
    }

    $scope.cancel = function() {
        if ($scope.saving) {
            return;
        }

        window.location.href = 'pebblejs://close#cancel';
    };

    function close(config) {
        console.log(config);
        window.location.href = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(config));

        $scope.saving = false;
    }

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
            $scope.saving = true;

            var config = angular.copy($scope.config);
            delete config.last_aqi_location;

            for (var index in configuration_meta.config) {
                var meta = configuration_meta.config[index];

                if (meta.type == 'int') {
                    config[meta.name] = Math.abs(parseInt(config[meta.name]));
                }
            }

            if ($scope.config.location) {
                if ($scope.config.location != originalLocation) {
                    $http.get('https://unwiredlabs.com/v2/search.php?token=9c872d2d66de74&q=' + $scope.config.location).then(function(result) {
                        config.lat = result.data.address[0].lat;
                        config.lng = result.data.address[0].lon;

                        close(config);
                    }, function(err) {
                        console.log('Error performing geocoding lookup', err);
                        $scope.locationError = 'An error occured finding the coodinates for this locaiton';

                        config.location = '';
                        config.lat = '';
                        config.lng = '';
                        close(config);

                        $scope.saving = false;
                    });
                }
                else {
                    close(config);
                }
            }
            else {
                config.location = '';
                config.lat = '';
                config.lng = '';
                close(config);
            }
        }
    };

    $timeout(function() {
        var query = $location.search();
        if (query.version) {
            $scope.version = parseFloat(query.version);
        }

        if (query.platform) {
            $scope.platform = query.platform;
        }

        if (query.dl) {
            $scope.debug.datalog = query.dl;
        }

        if (query.lsc) {
            $scope.debug.last_status_code = query.lsc;
        }

        if (query.llec) {
            $scope.debug.last_location_error_code = query.llec;
        }

        console.log('version: ' + $scope.version);
        console.log('lastest version: ' + $scope.latestVersion);

        var hash = $location.hash();
        if (hash) {
            var config = JSON.parse(decodeURIComponent(hash));

            for (var index in configuration_meta.config) {
                var meta = configuration_meta.config[index];

                $scope.config[meta.name] = (config[meta.name] === undefined) ? null : config[meta.name];
            }

            console.log($scope.config);
        }

        if ($scope.config.location == 'null') {
            $scope.config.location = '';
            $scope.config.lat = '';
            $scope.config.lng = '';
        }

        originalLocation = $scope.config.location;
        $scope.debug.config = $scope.config;
        $scope.debug.version = $scope.version;
        $scope.debug.platform = $scope.platform;

        if ($scope.platform == "aplite") { //Don't show health options
            $scope.status_items = $scope.status_items.slice(0, 8);
        }

        if ($scope.version < 6.1) { // New providers came in v6.1
            $scope.weather_provider = $scope.weather_provider.slice(0, 4);
        }

        $scope.loaded = true;
    });
});
