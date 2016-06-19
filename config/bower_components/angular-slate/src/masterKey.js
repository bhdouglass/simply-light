'use strict';

angular.module('angular-slate').directive('masterKey', function($http) {
    return {
        restrict: 'E',
        scope: {
            model: '=ngModel',
            logged_in: '=loggedIn',
            title: '@title',
            email_placeholder: '@emailPlaceholder',
            pin_placeholder: '@pinPlaceholder',
            fetch_button: '@fetchButton',
            logged_in_text: '@loggedInText',
            fetch_again_button: '@fetchAgainButton',
        },
        replace: true,
        template: '<div class="item-container-content angular-slate">' +
            '<label class="item">' +
                '<a href="https://www.pmkey.xyz/" target="_blank">{{title || \'Master Key\'}}</a>' +
                '<div ng-if="logged_in">' +
                    '{{logged_in_text || \'Your Master Key data has been saved.\'}}' +
                    '<div class="button-container">' +
                        '<input type="button" class="item-button clickable" value="{{fetch_again_button || \'Fetch Keys Again\'}}" ng-click="logout()" />' +
                    '</div>' +
                '</div>' +
                '<div ng-if="!logged_in">' +
                    '<div class="item-input-wrapper">' +
                        '<input type="text" class="item-input" id="master_key_email" ng-model="master_key.email" placeholder="{{email_placeholder || \'Master Key Email\'}}" />' +
                    '</div>' +
                    '<div class="item-input-wrapper">' +
                        '<input type="number" class="item-input" id="master_key_pin" ng-model="master_key.pin" placeholder="{{pin_placeholder || \'Master Key Pin\'}}" />' +
                    '</div>' +
                    '<div class="button-container">' +
                        '<input type="button" class="item-button clickable" value="{{fetch_button || \'Fetch Keys\'}}" ng-click="fetch()" />' +
                    '</div>' +
                '</div>' +
            '</label>' +
        '</div>',
        link: function($scope) {
            $scope.master_key = {
                'email': '',
                'pin': '',
            };

            $scope.logout = function() {
                $scope.logged_in = false;
            };

            $scope.fetch = function() {
                $http.get('https://pmkey.xyz/search/?email=' + $scope.master_key.email + '&pin=' + $scope.master_key.pin).then(function(res) {
                    if (res.data.success && res.data.keys) {
                        $scope.model = res.data.keys;
                        $scope.logged_in = true;
                    }
                    else {
                        console.error('An error occured fetching master key data', res);
                    }
                }, function(err) {
                    console.error('An error occured fetching master key data', err);
                });
            };
        }
    };
});
