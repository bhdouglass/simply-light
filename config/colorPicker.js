'use strict';

angular.module('app').directive('colorPicker', function() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        require: 'ngModel',
        template: '<div class="btn-group color-picker">' +
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                '<span class="color" ng-style="style(model)" ng-if="model"></span> <span ng-bind="model ? model.name : \'Choose a color\'"></span> <span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="color in colors">' +
                    '<a ng-click="setModel(color)">' +
                        '<span class="color" ng-style="style(color)"></span> <span ng-bind="color.name"></span>' +
                    '</a>' +
                '</li>' +
            '</ul>' +
        '</div>',
        link: function($scope, $element, $attrs, ngModel) {
            if ($attrs.platform == 'aplite') {
                $scope.colors = aplite_colors;
            }
            else {
                $scope.colors = basalt_colors;
            }

            ngModel.$formatters.push(function(modelValue) {
                var viewValue = null;
                angular.forEach($scope.colors, function(color) {
                    if (color.pebble == modelValue) {
                        viewValue = color;
                    }
                });

                return viewValue;
            });

            ngModel.$render = function() {
                $scope.model = ngModel.$viewValue;
            };

            ngModel.$parsers.push(function(viewValue) {
                return viewValue ? viewValue.pebble : null;
            });

            $scope.$watch('model', function() {
                ngModel.$setViewValue($scope.model);
            }, true);

            $scope.setModel = function(color) {
                $scope.model = color;
            };

            $scope.style = function(color) {
                var style = {};
                if (color) {
                    style = {
                        'background-color': color.hex,
                    };

                    if (color.name == 'White') {
                        style.border = 'black solid 1px';
                    }
                }

                return style;
            };
        }
    };
});
