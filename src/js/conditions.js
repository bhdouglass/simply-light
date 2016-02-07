var enums = require('enums');

function yahooCondition(code) {
    var returnCode = enums.CLEAR;
    if (code >= 31 && code <= 34) { //Clear
        returnCode = enums.CLEAR;
    }
    else if ((code >= 26 && code <= 30) || code == 44) { //Cloudy
        returnCode = enums.CLOUDY;
    }
    else if (code >= 19 && code <= 22) { //Atmosphere (dust, fog, etc)
        returnCode = enums.FOG;
    }
    else if (code >= 8 && code <= 9) { //Drizzle
        returnCode = enums.LIGHT_RAIN;
    }
    else if ((code >= 10 && code <= 12) || code == 40) { //Rain
        returnCode = enums.RAIN;
    }
    else if (code >= 5 && code <= 6) { //Mixed rain
        returnCode = enums.RAIN;
    }
    else if ((code >= 3 && code <= 4) || (code >= 37 && code <= 39) || code == 45 || code == 47) { //Thunderstorm
        returnCode = enums.THUNDERSTORM;
    }
    else if ((code >= 13 && code <= 16) || (code >= 41 && code <= 43) || code == 46) { //Snow
        returnCode = enums.SNOW;
    }
    else if (code == 7) { //Mixed snow
        returnCode = enums.SNOW;
    }
    else if ((code >= 17 && code <= 18) || code == 35) { //Hail
        returnCode = enums.HAIL;
    }
    else if (code >= 23 && code <= 24) { //Wind
        returnCode = enums.WIND;
    }
    else if (code === 0) { //Tornado
        returnCode = enums.TORNADO;
    }
    else if (code >= 1 && code <= 2) { //Hurricane
        returnCode = enums.HURRICANE;
    }
    else if (code == 25) { //Cold
        returnCode = enums.EXTREME_COLD;
    }
    else if (code == 36) { //Hot
        returnCode = enums.EXTREME_HEAT;
    }

    return returnCode;
}

function openWeatherMapCondition(code) {
    var returnCode = enums.CLEAR;
    if (code == 800 || code == 951) { //Clear/Calm
        returnCode = enums.CLEAR;
    }
    else if (code > 800 && code < 900) { //Clouds
        returnCode = enums.CLOUDY;
    }
    else if (code >= 700 && code < 800) { //Atmosphere (mist, fog, etc)
        returnCode = enums.FOG;
    }
    else if (code >= 300 && code < 400) { //Drizzle
        returnCode = enums.LIGHT_RAIN;
    }
    else if (code >= 500 && code < 600) { //Rain
        returnCode = enums.RAIN;
    }
    else if (code >= 200 && code < 300) { //Thunderstorm
        returnCode = enums.THUNDERSTORM;
    }
    else if (code >= 600 && code < 700) { //Snow
        returnCode = enums.SNOW;
    }
    else if (code == 906) { //Hail
        returnCode = enums.HAIL;
    }
    else if (code >= 907 && code < 957) { //Wind
        returnCode = enums.WIND;
    }
    else if (code == 905 || (code >= 957 && code < 1000)) { //Extreme Wind
        returnCode = EXTREME_WIND;
    }
    else if (code == 900) { //Tornado
        returnCode = enums.TORNADO;
    }
    else if (code == 901 || code == 902 || code == 962) { //Hurricane
        returnCode = enums.HURRICANE;
    }
    else if (code == 903) { //Extreme cold
        returnCode = enums.EXTREME_COLD;
    }
    else if (code == 904) { //Extreme heat
        returnCode = enums.EXTREME_HEAT;
    }

    return returnCode;
}

//Reference: http://api.yr.no/weatherapi/weathericon/1.1/documentation
function yrnoCondition(code) {
    var returnCode = enums.CLEAR;

    if (code > 100) {
        code -= 100;
    }

    var map = {
        1: enums.CLEAR, //1 Sun
        2: enums.CLOUDY, //2 LightCloud
        3: enums.CLOUDY, //3 PartlyCloud
        4: enums.CLOUDY, //4 Cloud
        5: enums.LIGHT_RAIN, //5 LightRainSun
        6: enums.THUNDERSTORM, //6 LightRainThunderSun
        7: enums.SNOW, //7 SleetSun
        8: enums.SNOW, //8 SnowSun
        9: enums.LIGHT_RAIN, //9 LightRain
        10: enums.RAIN, //10 Rain
        11: enums.THUNDERSTORM, //11 RainThunder
        12: enums.SNOW, //12 Sleet
        13: enums.SNOW, //13 Snow
        14: enums.SNOW_THUNDERSTORM, //14 SnowThunder
        15: enums.FOG, //15 Fog
        20: enums.SNOW_THUNDERSTORM, //20 SleetSunThunder
        21: enums.SNOW_THUNDERSTORM, //21 SnowSunThunder
        22: enums.THUNDERSTORM, //22 LightRainThunder
        23: enums.SNOW_THUNDERSTORM, //23 SleetThunder
        24: enums.THUNDERSTORM, //24 DrizzleThunderSun
        25: enums.THUNDERSTORM, //25 RainThunderSun
        26: enums.SNOW_THUNDERSTORM, //26 LightSleetThunderSun
        27: enums.SNOW_THUNDERSTORM, //27 HeavySleetThunderSun
        28: enums.SNOW_THUNDERSTORM, //28 LightSnowThunderSun
        29: enums.SNOW_THUNDERSTORM, //29 HeavySnowThunderSun
        30: enums.THUNDERSTORM, //30 DrizzleThunder
        31: enums.SNOW_THUNDERSTORM, //31 LightSleetThunder
        32: enums.SNOW_THUNDERSTORM, //32 HeavySleetThunder
        33: enums.SNOW_THUNDERSTORM, //33 LightSnowThunder
        34: enums.SNOW_THUNDERSTORM, //34 HeavySnowThunder
        40: enums.LIGHT_RAIN, //40 DrizzleSun
        41: enums.RAIN, //41 RainSun
        42: enums.SNOW, //42 LightSleetSun
        43: enums.SNOW, //43 HeavySleetSun
        44: enums.SNOW, //44 LightSnowSun
        45: enums.SNOW, //45 HeavysnowSun
        46: enums.LIGHT_RAIN, //46 Drizzle
        47: enums.SNOW, //47 LightSleet
        48: enums.SNOW, //48 HeavySleet
        49: enums.SNOW, //49 LightSnow
        50: enums.SNOW, //50 HeavySnow
    };

    if (map[code]) {
        returnCode = map[code];
    }

    return returnCode;
}

function forecastioCondition(code) {
    var returnCode = enums.CLEAR;

    var map = {
        'clear-day': enums.CLEAR,
        'clear-night': enums.CLEAR,
        'rain': enums.RAIN,
        'snow': enums.SNOW,
        'sleet': enums.SNOW,
        'wind': enums.WIND,
        'fog': enums.FOG,
        'cloudy': enums.CLOUDY,
        'partly-cloudy-day': enums.CLOUDY,
        'partly-cloudy-night': enums.CLOUDY,
        'hail': enums.SNOW,
        'thunderstorm': enums.THUNDERSTORM,
        'tornado': enums.TORNADO,
    };

    if (map[code]) {
        returnCode = map[code];
    }

    return returnCode;
}

module.exports.yahooCondition = yahooCondition;
module.exports.openWeatherMapCondition = openWeatherMapCondition;
module.exports.yrnoCondition = yrnoCondition;
module.exports.forecastioCondition = forecastioCondition;
