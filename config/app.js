'use strict';

angular.module('app', ['angular-slate']);

angular.module('app').config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
