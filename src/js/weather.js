//Formulas from http://en.wikipedia.org/wiki/Wind_chill#North_American_and_United_Kingdom_wind_chill_index
function windChill(temperature, velocity) {
    var wind_chill = temperature;
    var v = Math.pow(velocity, 0.16);
    if (config.temperature_units == 'imperial') {
        wind_chill = 35.74 + 0.6215 * temperature - 35.75 * v + 0.4275 * temperature * v;
    }
    else if (config.temperature_units == 'metric') {
        wind_chill = 13.12 + 0.6215 * temperature - 11.37 * v + 0.3965 * temperature * v;
    }
    else { //kelvin
        temperature -= 273.15;
        wind_chill = 13.12 + 0.6215 * temperature - 11.37 * v + 0.3965 * temperature * v;
        wind_chill += 273.15;
    }

    return wind_chill;
}

//Formula from http://en.wikipedia.org/wiki/Heat_index#Formula
function heatIndex(temperature, humidity) {
    var t = temperature;
    if (config.temperature_units == 'metric') {
        t = (temperature * 9 / 5) + 32;
    }
    else if (!config.temperature_units) { //kelvin
        t = ((temperature - 273.15) * 9 / 5) + 32;
    }

    var heat_index = temperature;
    if (t >= 80 && humidity >= 40) {
        var tsq = Math.pow(t, 2);
        var hsq = Math.pow(humidity, 2);
        var c = [
            null, //not used
            -42.379,
            2.04901523,
            10.14333127,
            -0.22475541,
            -0.00683783,
            -0.05481717,
            0.00122874,
            0.00085282,
            -0.00000199
        ];

        heat_index = c[1] +
            (c[2]* t) +
            (c[3]* humidity) +
            (c[4]* t * humidity) +
            (c[5]* tsq) +
            (c[6]* hsq) +
            (c[7]* tsq * humidity) +
            (c[8]* t * hsq) +
            (c[9]* tsq * hsq);

        if (config.temperature_units == 'metric') {
            heat_index = (heat_index - 32) * 5 / 9;
        }
        else if (!config.temperature_units) { //kelvin
            heat_index = (heat_index = (heat_index - 32) * 5 / 9) + 273.15;
        }
    }

    return heat_index;
}

function convertYahooTime(string) {
    string = string.toLowerCase();
    var time = string.replace('am', '').replace('pm', '').replace(' ', '');
    var split = string.split(':');
    var hours = parseInt(split[0]);
    var minutes = parseInt(split[1]);

    if (string.indexOf('pm') >= 0) {
        hours += 12;
    }

    return (hours * 60) + minutes;
}

function yahooWeather(pos, callback) {
    var geo = '';
    /*if (config.location) {
        geo = 'select woeid from geo.places where text="' + config.location + '"';
    }
    else {*/
        geo = 'select woeid from geo.placefinder where text="' + pos.coords.latitude + ',' + pos.coords.longitude + '" and gflags="R"';
    //}

    var unit = 'c';
    if (config.temperature_units == 'imperial') {
        unit = 'f';
    }

    var select = 'select * from weather.forecast where woeid in (' + geo + ') and u="' + unit + '"';
    console.log(select);
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent(select);
    console.log(url);

    get(url, function(response) {
        var json = JSON.parse(response);
        var data = {};
        if (Array.isArray(json.query.results)) {
            data = json.query.results[0].channel;
        }
        else {
            data = json.query.results.channel;
        }

        var title = data.title;
        var temperature = Math.round(data.item.condition.temp);
        var condition = yahooCondition(data.item.condition.code);
        var sunrise = convertYahooTime(data.astronomy.sunrise);
        var sunset = convertYahooTime(data.astronomy.sunset);

        if (config.temperature_units === '') {
            temperature += 273.15;
        }

        console.log('temp:       ' + temperature);
        console.log('cond:       ' + condition);
        console.log('title:      ' + title);
        console.log('sunrise:    ' + sunrise);
        console.log('sunset:     ' + sunset);

        if (config.feels_like == 1) {
            temperature = Math.round(data.wind.chill);
            if (config.temperature_units === '') {
                temperature += 273.15;
            }

            console.log('wind cill:  ' + temperature);
        }
        else if (config.feels_like == 2) {
            temperature = heatIndex(data.item.condition.temp, data.atmosphere.humidity);
            console.log('heat index: ' + temperature);
        }

        callback(pos, {
            temperature: temperature,
            condition: condition,
            sunrise: sunrise,
            sunset: sunset,
            err: NO_ERROR,
        });

    }, function(err) {
        console.warn('Error while getting weather: ' + err.status);

        callback(pos, {
            temperature: -999,
            condition: -999,
            err: WEATHER_ERROR,
        });
    });
}

function openWeatherMapWeather(pos, callback) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?APPID=ce255d859db621b13bb985a4e06a4a18&';
    if (config.location) {
        url += 'q=' + config.location;
    }
    else {
        url += 'lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude;
    }

    if (config.temperature_units) {
        url += '&units=' + config.temperature_units;
    }

    console.log(url);
    get(url, function(response) {
        var json = JSON.parse(response);

        var temperature = Math.round(json.main.temp);
        var location = json.name;
        var condition = openWeatherMapCondition(json.weather[0].id);

        var sunrise_date = new Date(json.sys.sunrise * 1000);
        var sunset_date = new Date(json.sys.sunset * 1000);
        var sunrise = sunrise_date.getHours() * 60 + sunrise_date.getMinutes();
        var sunset = sunset_date.getHours() * 60 + sunset_date.getMinutes();

        console.log('temp:       ' + temperature);
        console.log('cond:       ' + condition + ' - ' + json.weather.length);
        console.log('loc:        ' + location);
        console.log('sunrise:    ' + sunrise);
        console.log('sunset:     ' + sunset);

        if (config.feels_like == 1) {
            temperature = Math.round(windChill(json.main.temp, json.wind.speed));
            console.log('wind cill:  ' + temperature);
        }
        else if (config.feels_like == 2) {
            temperature = heatIndex(json.main.temp, data.atmosphere.humidity);
            console.log('heat index: ' + temperature);
        }

        callback(pos, {
            temperature: temperature,
            condition: condition,
            sunrise: sunrise,
            sunset: sunset,
            err: NO_ERROR,
        });

    }, function(err) {
        console.warn('Error while getting weather: ' + err.status);

        callback(pos, {
            temperature: -999,
            condition: -999,
            err: WEATHER_ERROR,
        });
    });
}

function fetchWeather(pos, callback) {
    if (config.weather_provider === 0) {
        openWeatherMapWeather(pos, callback);
    }
    else {
        yahooWeather(pos, callback);
    }
}
