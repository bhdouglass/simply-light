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
            sync_button: '@syncButton',
            logged_in_text: '@loggedInText',
            sync_again_button: '@syncAgainButton',
        },
        replace: true,
        template: '<div class="item-container-content angular-slate">' +
            '<label class="item">' +
                '<a href="https://www.pmkey.xyz/" target="_blank">{{title || \'Master Key\'}}</a>' +
                '<div ng-if="logged_in">' +
                    '{{logged_in_text || \'Your Master Key data has been saved.\'}}' +
                    '<div class="button-container">' +
                        '<input type="button" class="item-button clickable" value="{{sync_again_button || \'Sync Keys Again\'}}" ng-click="logout()" />' +
                    '</div>' +
                '</div>' +
                '<div class="item-input-wrapper" ng-if="!logged_in">' +
                    '<input type="text" class="item-input" id="master_key_email" ng-model="master_key.email" placeholder="{{email_placeholder || \'Master Key Email\'}}" />' +
                '</div>' +
            '</label>' +
            '<div class="item" ng-if="!logged_in">' +
                '<div class="item-input-wrapper item-input-wrapper-button">' +
                    '<input type="number" class="item-input" id="master_key_pin" ng-model="master_key.pin" placeholder="{{pin_placeholder || \'Master Key Pin\'}}" />' +
                '</div>' +
                '<input type="button" class="item-button item-input-button clickable" value="{{sync_button || \'Sync\'}}" ng-click="sync()" />' +
            '</div>' +
        '</div>',
        link: function($scope) {
            $scope.master_key = {
                'email': '',
                'pin': '',
            };

            $scope.logout = function() {
                $scope.logged_in = false;
            };

            $scope.sync = function() {
                $http.get('https://pmkey.xyz/search/?email=' + $scope.master_key.email + '&pin=' + $scope.master_key.pin).then(function(res) {
                    if (res.data.success && res.data.keys) {
                        $scope.model = res.data.keys;
                        $scope.logged_in = true;
                    }
                    else {
                        console.error('An error occured syncing master key data', res);
                    }
                }, function(err) {
                    console.error('An error occured syncing master key data', err);
                });
            };
        }
    };
});
