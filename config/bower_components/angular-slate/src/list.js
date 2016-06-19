'use strict';

angular.module('angular-slate').directive('list', function() {
    return {
        restrict: 'E',
        scope: {
            model: '=ngModel',
        },
        replace: true,
        template: '<div class="item-container-content angular-slate">' +
            '<div class="item-dyn-list">' +
                '<label class="item" ng-repeat="item in model">' +
                    '{{item}}' +
                    '<div class="delete-item" ng-click="model.splice($index, 1)"></div>' +
                '</label>' +
                '<div class="item" ng-show="adding">' +
                    '<div class="item-input-wrapper">' +
                        '<input class="item-input" type="text" name="focus-box" ng-model="text" ng-keydown="keypress($event)" />' +
                    '</div>' +
                '</div>' +
                '<div class="item add-item" ng-click="adding = true">Add one more...</div>' +
            '</div>' +
        '</div>',
        link: function($scope) {
            $scope.adding = false;
            $scope.text = '';

            $scope.keypress = function(event) {
                if (event.keyCode == 13) { //enter
                    $scope.model.push($scope.text);
                    $scope.text = '';
                    $scope.adding = false;
                }
            };
        }
    };
});
