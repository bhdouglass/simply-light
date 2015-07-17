//Colors from http://developer.getpebble.com/tools/color-picker
var colors = require('./colors.json');
var fs = require('fs');

var newcolors = [];
for (var color in colors) {
    newcolors.push({
        name: colors[color].name,
        hex: colors[color].html,
        pebble: parseInt(colors[color].binary.substring(2), 2),
    });
}

newcolors.sort(function(a, b) {
    var value = 0;
    if (a.hex < b.hex) {
        value = -1;
    }
    else if (a.hex > b.hex) {
        value = 1;
    }

    return value;
});

//Borrowed from http://www.runtime-era.com/2011/11/grouping-html-hex-colors-by-hue-in.html
for (var c = 0; c < newcolors.length; c++) {
    /* Get the hex value without hash symbol. */
    var hex = newcolors[c].hex.substring(1);

    /* Get the RGB values to calculate the Hue. */
    var r = parseInt(hex.substring(0,2),16)/255;
    var g = parseInt(hex.substring(2,4),16)/255;
    var b = parseInt(hex.substring(4,6),16)/255;

    /* Getting the Max and Min values for Chroma. */
    var max = Math.max.apply(Math, [r,g,b]);
    var min = Math.min.apply(Math, [r,g,b]);

    /* Variables for HSV value of hex color. */
    var chr = max-min;
    var hue = 0;
    var val = max;
    var sat = 0;

    if (val > 0) {
        /* Calculate Saturation only if Value isn't 0. */
        sat = chr/val;
        if (sat > 0) {
            if (r == max) {
                hue = 60*(((g-min)-(b-min))/chr);
                if (hue < 0) {hue += 360;}
            } else if (g == max) {
                hue = 120+60*(((b-min)-(r-min))/chr);
            } else if (b == max) {
                hue = 240+60*(((r-min)-(g-min))/chr);
            }
        }
    }

    /* Modifies existing objects by adding HSV values. */
    newcolors[c].hue = hue;
    newcolors[c].sat = sat;
    newcolors[c].val = val;
}

/* Sort by Hue. */
newcolors = newcolors.sort(function(a,b){return a.hue - b.hue;});

//Get rid of extras added by sort
for (var i = 0; i < newcolors.length; i++) {
    newcolors[i] = {
        name: newcolors[i].name,
        hex: newcolors[i].hex,
        pebble: newcolors[i].pebble,
    };
}

console.log(JSON.stringify(newcolors));
