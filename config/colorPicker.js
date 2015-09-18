'use strict';

angular.module('app').directive('colorPicker', function() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        require: 'ngModel',
        template: '<div class="item-container-content">' +
            '<label class="item">' +
                '{{title}}' +
                '<span class="color" ng-style="style(model)"></span>' +
                '<select class="item-select" ng-model="model" ng-options="c.name for c in colors"></select>' +
                '<div class="select-triangle"></div>' + //Not sure why this isn't automatic
            '</label>' +
        '</div>',
        link: function($scope, $element, $attrs, ngModel) {
            $scope.title = $attrs.title;

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
                    else {
                        style.border = color.hex + ' solid 1px';
                    }
                }

                return style;
            };
        }
    };
});
