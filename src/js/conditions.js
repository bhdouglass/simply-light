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
