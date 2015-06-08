'use strict';

angular.module('app').directive('colorPicker', function() {
    return {
        restrict: 'E',
        scope: {
            model: '=ngModel'
        },
        replace: true,
        template: '<div class="btn-group">' +
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
        link: function($scope) {
            $scope.colors = colors;

            $scope.setModel = function(color) {
                $scope.model = color;
            };

            $scope.style = function(color) {
                var style = {};
                if (color) {
                    style = {
                        'background-color': color.hex,
                    };
                }

                return style;
            };
        }
    };
});
