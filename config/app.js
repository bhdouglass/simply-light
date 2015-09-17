'use strict';

angular.module('app', []);

angular.module('app').config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
