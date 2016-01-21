function yahooCondition(code) {
    var returnCode = CLEAR;
    if (code >= 31 && code <= 34) { //Clear
        returnCode = CLEAR;
    }
    else if ((code >= 26 && code <= 30) || code == 44) { //Cloudy
        returnCode = CLOUDY;
    }
    else if (code >= 19 && code <= 22) { //Atmosphere (dust, fog, etc)
        returnCode = FOG;
    }
    else if (code >= 8 && code <= 9) { //Drizzle
        returnCode = LIGHT_RAIN;
    }
    else if ((code >= 10 && code <= 12) || code == 40) { //Rain
        returnCode = RAIN;
    }
    else if (code >= 5 && code <= 6) { //Mixed rain
        returnCode = RAIN;
    }
    else if ((code >= 3 && code <= 4) || (code >= 37 && code <= 39) || code == 45 || code == 47) { //Thunderstorm
        returnCode = THUNDERSTORM;
    }
    else if ((code >= 13 && code <= 16) || (code >= 41 && code <= 43) || code == 46) { //Snow
        returnCode = SNOW;
    }
    else if (code == 7) { //Mixed snow
        returnCode = SNOW;
    }
    else if ((code >= 17 && code <= 18) || code == 35) { //Hail
        returnCode = HAIL;
    }
    else if (code >= 23 && code <= 24) { //Wind
        returnCode = WIND;
    }
    else if (code === 0) { //Tornado
        returnCode = TORNADO;
    }
    else if (code >= 1 && code <= 2) { //Hurricane
        returnCode = HURRICANE;
    }
    else if (code == 25) { //Cold
        returnCode = EXTREME_COLD;
    }
    else if (code == 36) { //Hot
        returnCode = EXTREME_HEAT;
    }

    return returnCode;
}

function openWeatherMapCondition(code) {
    var returnCode = CLEAR;
    if (code == 800 || code == 951) { //Clear/Calm
        returnCode = CLEAR;
    }
    else if (code > 800 && code < 900) { //Clouds
        returnCode = CLOUDY;
    }
    else if (code >= 700 && code < 800) { //Atmosphere (mist, fog, etc)
        returnCode = FOG;
    }
    else if (code >= 300 && code < 400) { //Drizzle
        returnCode = LIGHT_RAIN;
    }
    else if (code >= 500 && code < 600) { //Rain
        returnCode = RAIN;
    }
    else if (code >= 200 && code < 300) { //Thunderstorm
        returnCode = THUNDERSTORM;
    }
    else if (code >= 600 && code < 700) { //Snow
        returnCode = SNOW;
    }
    else if (code == 906) { //Hail
        returnCode = HAIL;
    }
    else if (code >= 907 && code < 957) { //Wind
        returnCode = WIND;
    }
    else if (code == 905 || (code >= 957 && code < 1000)) { //Extreme Wind
        returnCode = EXTREME_WIND;
    }
    else if (code == 900) { //Tornado
        returnCode = TORNADO;
    }
    else if (code == 901 || code == 902 || code == 962) { //Hurricane
        returnCode = HURRICANE;
    }
    else if (code == 903) { //Extreme cold
        returnCode = EXTREME_COLD;
    }
    else if (code == 904) { //Extreme heat
        returnCode = EXTREME_HEAT;
    }

    return returnCode;
}

//Reference: http://api.yr.no/weatherapi/weathericon/1.1/documentation
function yrnoCondition(code) {
    var returnCode = CLEAR;

    if (code > 100) {
        code -= 100;
    }

    var map = {
        1: CLEAR, //1 Sun
        2: CLOUDY, //2 LightCloud
        3: CLOUDY, //3 PartlyCloud
        4: CLOUDY, //4 Cloud
        5: LIGHT_RAIN, //5 LightRainSun
        6: THUNDERSTORM, //6 LightRainThunderSun
        7: SNOW, //7 SleetSun
        8: SNOW, //8 SnowSun
        9: LIGHT_RAIN, //9 LightRain
        10: RAIN, //10 Rain
        11: THUNDERSTORM, //11 RainThunder
        12: SNOW, //12 Sleet
        13: SNOW, //13 Snow
        14: SNOW_THUNDERSTORM, //14 SnowThunder
        15: FOG, //15 Fog
        20: SNOW_THUNDERSTORM, //20 SleetSunThunder
        21: SNOW_THUNDERSTORM, //21 SnowSunThunder
        22: THUNDERSTORM, //22 LightRainThunder
        23: SNOW_THUNDERSTORM, //23 SleetThunder
        24: THUNDERSTORM, //24 DrizzleThunderSun
        25: THUNDERSTORM, //25 RainThunderSun
        26: SNOW_THUNDERSTORM, //26 LightSleetThunderSun
        27: SNOW_THUNDERSTORM, //27 HeavySleetThunderSun
        28: SNOW_THUNDERSTORM, //28 LightSnowThunderSun
        29: SNOW_THUNDERSTORM, //29 HeavySnowThunderSun
        30: THUNDERSTORM, //30 DrizzleThunder
        31: SNOW_THUNDERSTORM, //31 LightSleetThunder
        32: SNOW_THUNDERSTORM, //32 HeavySleetThunder
        33: SNOW_THUNDERSTORM, //33 LightSnowThunder
        34: SNOW_THUNDERSTORM, //34 HeavySnowThunder
        40: LIGHT_RAIN, //40 DrizzleSun
        41: RAIN, //41 RainSun
        42: SNOW, //42 LightSleetSun
        43: SNOW, //43 HeavySleetSun
        44: SNOW, //44 LightSnowSun
        45: SNOW, //45 HeavysnowSun
        46: LIGHT_RAIN, //46 Drizzle
        47: SNOW, //47 LightSleet
        48: SNOW, //48 HeavySleet
        49: SNOW, //49 LightSnow
        50: SNOW, //50 HeavySnow
    };

    if (map[code]) {
        returnCode = map[code];
    }

    return returnCode;
}

function forecastioCondition(code) {
    var returnCode = CLEAR;

    var map = {
        'clear-day': CLEAR,
        'clear-night': CLEAR,
        'rain': RAIN,
        'snow': SNOW,
        'sleet': SNOW,
        'wind': WIND,
        'fog': FOG,
        'cloudy': CLOUDY,
        'partly-cloudy-day': CLOUDY,
        'partly-cloudy-night': CLOUDY,
        'hail': SNOW,
        'thunderstorm': THUNDERSTORM,
        'tornado': TORNADO,
    };

    if (map[code]) {
        returnCode = map[code];
    }

    return returnCode;
}
