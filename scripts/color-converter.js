//Colors from http://developer.getpebble.com/tools/color-picker
var json = require('./colors.json');
var fs = require('fs');

var colorMap = {};
for (var color in json) {
    colorMap[json[color].html] = json[color].name;
}


//From https://github.com/pebble/slate/blob/master/lib/js/main.js#L106
var order = [
    false    , false    , '#55FF00', '#AAFF55', false    , '#FFFF55', '#FFFFAA', false    , false    ,
    false    , '#AAFFAA', '#55FF55', '#00FF00', '#AAFF00', '#FFFF00', '#FFAA55', '#FFAAAA', false    ,
    '#55FFAA', '#00FF55', '#00AA00', '#55AA00', '#AAAA55', '#AAAA00', '#FFAA00', '#FF5500', '#FF5555',
    '#AAFFFF', '#00FFAA', '#00AA55', '#55AA55', '#005500', '#555500', '#AA5500', '#FF0000', '#FF0055',
    false    , '#55AAAA', '#00AAAA', '#005555', '#FFFFFF', '#000000', '#AA5555', '#AA0000', false    ,
    '#55FFFF', '#00FFFF', '#00AAFF', '#0055AA', '#AAAAAA', '#555555', '#550000', '#AA0055', '#FF55AA',
    '#55AAFF', '#0055FF', '#0000FF', '#0000AA', '#000055', '#550055', '#AA00AA', '#FF00AA', '#FFAAFF',
    false    , '#5555AA', '#5555FF', '#5500FF', '#5500AA', '#AA00FF', '#FF00FF', '#FF55FF', false    ,
    false    , false    , false    , '#AAAAFF', '#AA55FF', '#AA55AA', false    , false    , false    ,
]

var colors = [];
order.forEach(function(o) {
    if (o) {
        colors.push({
            name: colorMap[o],
            hex: o,
            pebble: parseInt(o.replace('#', '0x')),
        });
    }
    else {
        colors.push(null);
    }
});

console.log(JSON.stringify(colors));
