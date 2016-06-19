'use strict';

angular.module('app').directive('customColorPicker', function() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        require: 'ngModel',
        template: '<div class="item-container-content">' +
            '<label class="item">' +
                '{{title}}' +
                '<span ng-if="platform == \'aplite\'">' +
                    '<span class="color" ng-style="style(model)"></span>' +
                    '<select class="item-select" ng-model="model" ng-options="c.name for c in colors" ng-change="setModel(model)"></select>' +
                    '<div class="select-triangle"></div>' +
                '</span>' +
                '<span ng-if="platform != \'aplite\'">' +
                    '<span class="color-name" ng-bind="model.name"></span>' +
                    '<div class="item-styled-color">' +
                        '<span class="value clickable" ng-style="style(model)" ng-click="toggle()"></span>' +
                        '<div style="padding-bottom:100%" class="color-box-wrap show" ng-if="show">' +
                            '<div class="color-box-container">' +
                                '<i ng-repeat="c in colors track by $index" ng-click="setModel(c)" class="color-box" ng-class="{selectable: !!c, transparent: !c, \'clear-left\': $index % 9 == 0}" ng-style="style(c)"></i>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '<span>' +
            '</label>' +
        '</div>',
        link: function($scope, $element, $attrs, ngModel) {
            $scope.title = $attrs.title;
            $scope.show = false;

            $scope.platform = $attrs.platform;
            if ($scope.platform == 'aplite') {
                if ($attrs.background) {
                    $scope.colors = aplite_colors_background;
                }
                else {
                    $scope.colors = aplite_colors;
                }
            }
            else {
                $scope.colors = basalt_colors;
            }

            ngModel.$formatters.push(function(modelValue) {
                var viewValue = null;

                if (modelValue == 1 && $scope.platform != 'aplite') {
                    modelValue = 16777215;
                }

                angular.forEach($scope.colors, function(color) {
                    if (color && color.pebble == modelValue) {
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

            $scope.toggle = function() {
                $scope.show = !$scope.show;
            };

            $scope.setModel = function(color) {
                $scope.model = color;
                $scope.show = false;
            };

            $scope.style = function(color) {
                var style = {};
                if (color) {
                    style = {
                        'background-color': color.hex,
                    };

                    if ($scope.platform == 'aplite') {
                        if (color.name == 'White') {
                            style.border = 'black solid 1px';
                        }
                        else {
                            style.border = color.hex + ' solid 1px';
                        }
                    }
                }

                return style;
            };
        }
    };
});
