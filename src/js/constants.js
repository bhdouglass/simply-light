var configuration_meta = require('configMeta');

var constants = {
    //Errors
    NO_ERROR: 0,
    FETCH_ERROR: 1,
    WEATHER_ERROR: 2,
    LOCATION_ERROR: 3,
    AQI_ERROR: 4,

    //Conditions
    CLEAR: 0,
    CLOUDY: 1,
    FOG: 2,
    LIGHT_RAIN: 3,
    RAIN: 4,
    THUNDERSTORM: 5,
    SNOW: 6,
    HAIL: 7,
    WIND: 8,
    EXTREME_WIND: 9,
    TORNADO: 10,
    HURRICANE: 11,
    EXTREME_COLD: 12,
    EXTREME_HEAT: 13,
    SNOW_THUNDERSTORM: 14,
};

for (var enum_ in configuration_meta.enums) {
    var e = configuration_meta.enums[enum_];
    for (var key in e) {
        var constant_key = key
            .replace(/-/g, '')
            .replace(/'/g, '')
            .replace(/\./g, '')
            .replace(/\s\s+/g, ' ')
            .trim()
            .replace(/ /g, '_')
            .toUpperCase();
        constants[constant_key] = e[key];
    }
}

module.exports = constants;
