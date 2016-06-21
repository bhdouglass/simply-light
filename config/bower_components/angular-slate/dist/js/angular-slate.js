'use strict';

/**
 * Copyright (C) 2016  Brian Douglass (bhdouglass.com)
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License version 3, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY
 * QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public
 * License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */

angular.module('angular-slate', []);

'use strict';

angular.module('angular-slate').directive('colorPicker', function() {
    var aplite_colors = [{
            name: 'Black',
            hex: '#000000',
            pebble: 0
        }, {
            name: 'White',
            hex: '#FFFFFF',
            pebble: 1
        }, {
            name: 'Grey',
            hex: '#BBBBBB',
            pebble: 2
        }
    ];

    var basalt_colors = [
        null,
        null,
        {
            'name': 'Bright Green',
            'hex': '#55FF00',
            'pebble': 5635840
        }, {
            'name': 'Inchworm',
            'hex': '#AAFF55',
            'pebble': 11206485
        },
        null,
        {
            'name': 'Icterine',
            'hex': '#FFFF55',
            'pebble': 16777045
        }, {
            'name': 'Pastel Yellow',
            'hex': '#FFFFAA',
            'pebble': 16777130
        },
        null,
        null,
        null,
        {
            'name': 'Mint Green',
            'hex': '#AAFFAA',
            'pebble': 11206570
        }, {
            'name': 'Screamin\' Green',
            'hex': '#55FF55',
            'pebble': 5635925
        }, {
            'name': 'Green',
            'hex': '#00FF00',
            'pebble': 65280
        }, {
            'name': 'Spring Bud',
            'hex': '#AAFF00',
            'pebble': 11206400
        }, {
            'name': 'Yellow',
            'hex': '#FFFF00',
            'pebble': 16776960
        }, {
            'name': 'Rajah',
            'hex': '#FFAA55',
            'pebble': 16755285
        }, {
            'name': 'Melon',
            'hex': '#FFAAAA',
            'pebble': 16755370
        },
        null,
        {
            'name': 'Medium Aquamarine',
            'hex': '#55FFAA',
            'pebble': 5636010
        }, {
            'name': 'Malachite',
            'hex': '#00FF55',
            'pebble': 65365
        }, {
            'name': 'Islamic Green',
            'hex': '#00AA00',
            'pebble': 43520
        }, {
            'name': 'Kelly Green',
            'hex': '#55AA00',
            'pebble': 5614080
        }, {
            'name': 'Brass',
            'hex': '#AAAA55',
            'pebble': 11184725
        }, {
            'name': 'Limerick',
            'hex': '#AAAA00',
            'pebble': 11184640
        }, {
            'name': 'Chrome Yellow',
            'hex': '#FFAA00',
            'pebble': 16755200
        }, {
            'name': 'Orange',
            'hex': '#FF5500',
            'pebble': 16733440
        }, {
            'name': 'Sunset Orange',
            'hex': '#FF5555',
            'pebble': 16733525
        }, {
            'name': 'Celeste',
            'hex': '#AAFFFF',
            'pebble': 11206655
        }, {
            'name': 'Medium Spring Green',
            'hex': '#00FFAA',
            'pebble': 65450
        }, {
            'name': 'Jaeger Green',
            'hex': '#00AA55',
            'pebble': 43605
        }, {
            'name': 'May Green',
            'hex': '#55AA55',
            'pebble': 5614165
        }, {
            'name': 'Dark Green (X11)',
            'hex': '#005500',
            'pebble': 21760
        }, {
            'name': 'Army Green',
            'hex': '#555500',
            'pebble': 5592320
        }, {
            'name': 'Windsor Tan',
            'hex': '#AA5500',
            'pebble': 11162880
        }, {
            'name': 'Red',
            'hex': '#FF0000',
            'pebble': 16711680
        }, {
            'name': 'Folly',
            'hex': '#FF0055',
            'pebble': 16711765
        },
        null,
        {
            'name': 'Cadet Blue',
            'hex': '#55AAAA',
            'pebble': 5614250
        }, {
            'name': 'Tiffany Blue',
            'hex': '#00AAAA',
            'pebble': 43690
        }, {
            'name': 'Midnight Green (Eagle Green)',
            'hex': '#005555',
            'pebble': 21845
        }, {
            'name': 'White',
            'hex': '#FFFFFF',
            'pebble': 16777215
        }, {
            'name': 'Black',
            'hex': '#000000',
            'pebble': 0
        }, {
            'name': 'Rose Vale',
            'hex': '#AA5555',
            'pebble': 11162965
        }, {
            'name': 'Dark Candy Apple Red',
            'hex': '#AA0000',
            'pebble': 11141120
        },
        null,
        {
            'name': 'Electric Blue',
            'hex': '#55FFFF',
            'pebble': 5636095
        }, {
            'name': 'Cyan',
            'hex': '#00FFFF',
            'pebble': 65535
        }, {
            'name': 'Vivid Cerulean',
            'hex': '#00AAFF',
            'pebble': 43775
        }, {
            'name': 'Cobalt Blue',
            'hex': '#0055AA',
            'pebble': 21930
        }, {
            'name': 'Light Gray',
            'hex': '#AAAAAA',
            'pebble': 11184810
        }, {
            'name': 'Dark Gray',
            'hex': '#555555',
            'pebble': 5592405
        }, {
            'name': 'Bulgarian Rose',
            'hex': '#550000',
            'pebble': 5570560
        }, {
            'name': 'Jazzberry Jam',
            'hex': '#AA0055',
            'pebble': 11141205
        }, {
            'name': 'Brilliant Rose',
            'hex': '#FF55AA',
            'pebble': 16733610
        }, {
            'name': 'Picton Blue',
            'hex': '#55AAFF',
            'pebble': 5614335
        }, {
            'name': 'Blue Moon',
            'hex': '#0055FF',
            'pebble': 22015
        }, {
            'name': 'Blue',
            'hex': '#0000FF',
            'pebble': 255
        }, {
            'name': 'Duke Blue',
            'hex': '#0000AA',
            'pebble': 170
        }, {
            'name': 'Oxford Blue',
            'hex': '#000055',
            'pebble': 85
        }, {
            'name': 'Imperial Purple',
            'hex': '#550055',
            'pebble': 5570645
        }, {
            'name': 'Purple',
            'hex': '#AA00AA',
            'pebble': 11141290
        }, {
            'name': 'Fashion Magenta',
            'hex': '#FF00AA',
            'pebble': 16711850
        }, {
            'name': 'Rich Brilliant Lavender',
            'hex': '#FFAAFF',
            'pebble': 16755455
        },
        null,
        {
            'name': 'Liberty',
            'hex': '#5555AA',
            'pebble': 5592490
        }, {
            'name': 'Very Light Blue',
            'hex': '#5555FF',
            'pebble': 5592575
        }, {
            'name': 'Electric Ultramarine',
            'hex': '#5500FF',
            'pebble': 5570815
        }, {
            'name': 'Indigo (Web)',
            'hex': '#5500AA',
            'pebble': 5570730
        }, {
            'name': 'Vivid Violet',
            'hex': '#AA00FF',
            'pebble': 11141375
        }, {
            'name': 'Magenta',
            'hex': '#FF00FF',
            'pebble': 16711935
        }, {
            'name': 'Shocking Pink (Crayola)',
            'hex': '#FF55FF',
            'pebble': 16733695
        },
        null,
        null,
        null,
        null,
        {
            'name': 'Baby Blue Eyes',
            'hex': '#AAAAFF',
            'pebble': 11184895
        }, {
            'name': 'Lavender Indigo',
            'hex': '#AA55FF',
            'pebble': 11163135
        }, {
            'name': 'Purpureus',
            'hex': '#AA55AA',
            'pebble': 11163050
        },
        null,
        null,
        null,
    ];

    return {
        restrict: 'E',
        scope: {},
        replace: true,
        require: 'ngModel',
        template: '<span class="angular-slate">' +
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
        '</span>',
        link: function($scope, $element, $attrs, ngModel) {
            $scope.show = false;

            $scope.platform = $attrs.platform;
            if ($scope.platform == 'aplite') {
                $scope.colors = aplite_colors;
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

'use strict';

angular.module('angular-slate').directive('draggable', ["$timeout", function($timeout) {
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
}]);

'use strict';

angular.module('angular-slate').directive('kiezelpay', ["$http", function($http) {
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
}]);

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

'use strict';

angular.module('angular-slate').directive('masterKey', ["$http", function($http) {
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
}]);
