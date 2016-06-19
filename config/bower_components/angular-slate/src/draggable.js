'use strict';

angular.module('angular-slate').directive('draggable', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            model: '=ngModel',
            label: '@label',
        },
        replace: true,
        template: '<div class="item-container-content angular-slate">' +
            '<div class="item-draggable-list">' +
                '<label class="item item-{{$index}}" ng-repeat="item in model" ng-bind="item[label]"></label>' +
            '</ul>' +
        '</div>',
        link: function($scope, $element) {
            $timeout(function() {
                $($element.children()[0]).itemDraggableList();

                var observer = new MutationObserver(function() {
                    var order = [];
                    var children = $($element.children()[0]).children();
                    children.each(function(i) {
                        var classes = $(children[i]).attr("class").split(' ');
                        for (var j in classes) {
                            var cls = classes[j];
                            if (cls.substring(0, 5) == 'item-') {
                                order.push(parseInt(cls.substring(5)));
                                break;
                            }
                        }
                    });

                    $timeout(function() {
                        var updated_model = [];
                        for (var k in order) {
                            updated_model.push($scope.model[order[k]]);
                        }

                        $scope.model = updated_model;
                    });
                });

                observer.observe($element[0], {
                    childList: true,
                    subtree: true
                });
            });
        }
    };
});
