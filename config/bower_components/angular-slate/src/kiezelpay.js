'use strict';

angular.module('angular-slate').directive('kiezelpay', function($http) {
    var licensed_message = 'Thank you for purchasing this app!';
    var unlicensed_message = 'You have not yet purchased a license';
    var trial_message = 'You are currently running the trial app ({{hours}} hours left)';

    return {
        restrict: 'E',
        scope: {
            appid: '@appid',
            token: '=token',
            testing: '@testing',
            licensed_message: '@licensedMessage',
            unlicensed_message: '@unlicensedMessage',
            trial_message: '@trialMessage',
        },
        replace: true,
        template: '<div ng-class="{licensed: status == \'licensed\', unlicensed: status == \'unlicensed\', trial: status == \'trial\'}">{{message}}</div>',
        link: function($scope) {
            $scope.status = 'unlicensed';
            $scope.trial_hours = 1;

            function updateMessage() {
                if ($scope.status == 'licensed') {
                    $scope.message = $scope.licensed_message ? $scope.licensed_message : licensed_message;
                }
                else if ($scope.status == 'trial') {
                    var message = $scope.trial_message ? $scope.trial_message : trial_message;
                    $scope.message = message.replace('{{hours}}', $scope.trial_hours);
                }
                else {
                    $scope.message = $scope.unlicensed_message ? $scope.unlicensed_message : unlicensed_message;
                }
            }
            updateMessage();

            $scope.$watch('token', function() {
                if ($scope.token) {
                    $scope.status = 'unlicensed';
                    updateMessage();

                    var url = 'https://kiezelpay.com/api/v1/status?appid=' + $scope.appid + '&accounttoken=' + $scope.token;
                    if ($scope.testing == 'true') {
                        url += '&flags=3';
                    }

                    $http.get(url).then(function(res) {
                        $scope.status = res.data.status;
                        if ($scope.status == 'trial' && res.data.trialDurationInSeconds) {
                            var trial_hours = Math.ceil(res.data.trialDurationInSeconds / 3600);
                            $scope.trial_hours = trial_hours ? trial_hours : 1;
                        }
                        else {
                            $scope.trial_hours = 1;
                        }

                        updateMessage();

                    }, function(err) {
                        console.error('An error occured fetching kiezelpay info', err);
                    });
                }
            });
        }
    };
});
