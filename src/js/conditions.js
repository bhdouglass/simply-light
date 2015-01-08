function yahooConditionToOpenWeatherMap(code) {
	var returnCode = 0;
	if (code === 0) { //Tornado
		returnCode = 900;
	}
	else if (code >= 1 && code <= 2) { //Hurricane
		returnCode = 900;
	}
	else if ((code >= 3 && code <= 4) || (code >= 37 && code <= 39) || code == 45 || code == 47) { //Thunderstorm
		returnCode = 200;
	}
	else if (code >= 5 && code <= 6) { //Mixed rain
		returnCode = 500;
	}
	else if (code == 7) { //Mixed snow
		returnCode = 600;
	}
	else if (code >= 8 && code <= 9) { //Drizzle
		returnCode = 300;
	}
	else if ((code >= 10 && code <= 12) || code == 40) { //Rain
		returnCode = 501;
	}
	else if ((code >= 13 && code <= 16) || (code >= 41 && code <= 43) || code == 46) { //Snow
		returnCode = 601;
	}
	else if ((code >= 17 && code <= 18) || code == 35) { //Hail
		returnCode = 906;
	}
	else if (code >= 19 && code <= 22) { //Atmosphere (dust, fog, etc)
		returnCode = 700;
	}
	else if (code >= 23 && code <= 24) { //Wind
		returnCode = 907;
	}
	else if (code == 25) { //Cold
		returnCode = 903;
	}
	else if ((code >= 26 && code <= 30) || code == 44) { //Cloudy
		returnCode = 801;
	}
	else if (code >= 31 && code <= 34) { //Clear
		returnCode = 800;
	}
	else if (code == 36) { //Hot
		returnCode = 904;
	}

	return returnCode;
}
