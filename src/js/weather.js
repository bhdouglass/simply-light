//Formulas from http://en.wikipedia.org/wiki/Wind_chill#North_American_and_United_Kingdom_wind_chill_index
function windChill(temperature, velocity) { //TODO split this into 3 functions, one for each temp units
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
function heatIndex(temperature, humidity) { //TODO change this to only accept fahrenheit
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
            heat_index = ((heat_index - 32) * 5 / 9) + 273.15;
        }
    }

    return heat_index;
}

function celciusToFahrenheit(deg) {
    return (deg * 9 / 5) + 32;
}

function celciusToKelvin(deg) {
    return deg +  273.15;
}

function fahrenheitToCelcius(deg) {
    return (deg - 32) * 5 / 9;
}

function fahrenheitToKelvin(deg) {
    return celciusToKelvin(fahrenheitToCelcius(deg));
}

function meterspersecondToMilesperhour(velocity) {
    return velocity * 2.23694;
}

function meterspersecondToKilometersperhour(velocity) {
    return velocity * 3.6;
}

function milesperhourToKilometersperhour(velocity) {
    return velocity * 1.60934;
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
    var geo = 'select woeid from geo.places where text="(' + pos.coords.latitude + ',' + pos.coords.longitude + ')" limit 1';

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

        var temperature = -999;
        var condition = -999;
        var sunrise = 1;
        var sunset = 0;
        var err = WEATHER_ERROR;

        if (json.query.results) {
            if (Array.isArray(json.query.results)) {
                data = json.query.results[0].channel;
            }
            else {
                data = json.query.results.channel;
            }

            if (data.item.condition && data.item.condition.temp && data.item.condition.code) {
                var title = data.title;
                temperature = Math.round(data.item.condition.temp);
                condition = yahooCondition(data.item.condition.code);
                sunrise = convertYahooTime(data.astronomy.sunrise);
                sunset = convertYahooTime(data.astronomy.sunset);

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

                err = NO_ERROR;
            }
        }


        callback(pos, {
            temperature: temperature,
            condition: condition,
            sunrise: sunrise,
            sunset: sunset,
            err: err,
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
    log(LOG_OPENWEATHERMAP);
    var api_key = (config.openweathermap_api_key && config.openweathermap_api_key.length > 0) ? config.openweathermap_api_key : 'ce255d859db621b13bb985a4e06a4a18';
    var url = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + api_key;
    if (config.location) {
        url += '&q=' + config.location;
    }
    else {
        url += '&lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude;
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
            temperature = heatIndex(json.main.temp, json.main.humidity);
            console.log('heat index: ' + temperature);
        }

        log(LOG_WEATHER_SUCCESS);
        callback(pos, {
            temperature: temperature,
            condition: condition,
            sunrise: sunrise,
            sunset: sunset,
            err: NO_ERROR,
        });

    }, function(err) {
        console.warn('Error while getting weather: ' + err.status);

        log(LOG_WEATHER_ERROR);
        callback(pos, {
            temperature: -999,
            condition: -999,
            err: WEATHER_ERROR,
        });
    });
}

function yrnoWeather(pos, callback) {
    log(LOG_YRNOWEATHER);

    var x2js = new X2JS();
    var url = 'http://api.yr.no/weatherapi/locationforecast/1.9/?lat=' + pos.coords.latitude + ';lon=' + pos.coords.longitude;
    console.log(url);
    get(url, function(response) {
        var json = x2js.xml_str2json(response);

        var simple = [];
        var full = [];
        for (var index in json.weatherdata.product.time) {
            if (json.weatherdata.product.time[index].location.symbol) {
                simple.push(json.weatherdata.product.time[index]);
            }
            else {
                full.push(json.weatherdata.product.time[index]);
            }
        }

        //From https://github.com/evanshortiss/yr.no-forecast
        var simpleWeather = null;
        var fullWeather = null;
        var maxDifference = Infinity;
        var now = moment.utc(Date.now());

        for (var i in simple) {
            var to = moment.utc(simple[i]._to);
            var from = moment.utc(simple[i]._from);

            if ((from.isSame(now) || from.isBefore(now)) && (to.isSame(now) || to.isAfter(now))) {
                var diff = Math.abs(to.diff(from));
                if (diff < maxDifference) {
                    maxDifference = diff;
                    simpleWeather = simple[i];
                }
            }
        }

        maxDifference = Infinity;
        for (var f in full) {
            var difference = Math.abs(moment.utc(full[f].to).diff(now));
            if (difference < maxDifference) {
                maxDifference = difference;
                fullWeather = full[f];
            }
        }

        if (!fullWeather) {
            fullWeather = simpleWeather;
        }
        else if (simpleWeather) {
            for (var key in simpleWeather.location) {
                fullWeather.location[key] = simpleWeather.location[key];
            }
        }

        var temperature = -999;
        var condition = -999;

        if (fullWeather && fullWeather.location) {
            if (fullWeather.location.temperature && fullWeather.location.temperature._value) {
                var t = parseInt(fullWeather.location.temperature._value);
                if (config.temperature_units == 'imperial') {
                    temperature = Math.round(celciusToFahrenheit(t));
                }
                else if (config.temperature_units == 'metric') {
                    temperature = Math.round(t);
                }
                else { //kelvin
                    temperature = Math.round(celciusToKelvin(t));
                }
            }

            if (fullWeather.location.symbol && fullWeather.location.symbol._number) {
                condition = yrnoCondition(parseInt(fullWeather.location.symbol._number));
            }

            console.log('temp:       ' + temperature);
            console.log('cond:       ' + condition);

            if (temperature != -999) {
                if (config.feels_like == 1) {
                    if (fullWeather.location.windSpeed && fullWeather.location.windSpeed._mps) {
                        var speed = parseInt(fullWeather.location.windSpeed._mps);

                        if (config.temperature_units == 'imperial') {
                            temperature = Math.round(windChill(temperature, meterspersecondToMilesperhour(speed)));
                        }
                        else {
                            temperature = Math.round(windChill(temperature, meterspersecondToKilometersperhour(speed)));
                        }

                        console.log('wind cill:  ' + temperature);
                    }
                }
                else if (config.feels_like == 2) {
                    if (fullWeather.location.humidity && fullWeather.location.humidity._value && fullWeather.location.humidity._unit == 'percent') {
                        var humidity = parseInt(fullWeather.location.humidity._value);
                        temperature = heatIndex(temperature, humidity);

                        console.log('heat index: ' + temperature);
                    }
                }
            }
        }

        var lastChecked = window.localStorage.getItem('sunrise_last_checked');
        var lastCheckedDate = moment(window.localStorage.getItem('sunrise_last_checked'));
        var check = moment();
        console.log('last sunrise check: ' + lastCheckedDate.format() + ', diff: ' + check.diff(lastCheckedDate, 'hours'));

        if ((!lastChecked || check.diff(lastCheckedDate, 'hours') >= 24) && (config.day_text_color != config.night_text_color || config.day_background_color != config.night_background_color)) {
            log(LOG_YRNO_SUNRISE);

            var url = 'http://api.yr.no/weatherapi/sunrise/1.0/?lat=' + pos.coords.latitude + ';lon=' + pos.coords.longitude + ';date=' + moment().format('YYYY-MM-DD');
            console.log('getting sunrise/sunset: ' + url);
            get(url, function(response) {
                var sjson = x2js.xml_str2json(response);
                console.log(JSON.stringify(sjson));

                var weather = {
                    temperature: temperature,
                    condition: condition,
                    err: NO_ERROR,
                };

                if (sjson.astrodata && sjson.astrodata.time && sjson.astrodata.time.location && sjson.astrodata.time.location.sun) {
                    var sunrise_date = new Date(sjson.astrodata.time.location.sun._rise);
                    var sunset_date = new Date(sjson.astrodata.time.location.sun._set);

                    weather.sunrise = sunrise_date.getHours() * 60 + sunrise_date.getMinutes();
                    weather.sunset = sunset_date.getHours() * 60 + sunset_date.getMinutes();

                    console.log('sunrise:    ' + weather.sunrise);
                    console.log('sunset:     ' + weather.sunset);
                }

                console.log(check.format());
                window.localStorage.setItem('sunrise_last_checked', check.format());
                log(LOG_YRNO_SUNRISE_SUCCESS);
                callback(pos, weather);

            }, function(err) {
                console.warn('Error while getting sunrise: ' + err.status);

                //Pretend noting happened, we still have temp and condition
                log(LOG_YRNO_SUNRISE_ERROR);
                callback(pos, {
                    temperature: temperature,
                    condition: condition,
                    err: NO_ERROR,
                });
            });
        }
        else {
            log(LOG_WEATHER_SUCCESS);
            callback(pos, {
                temperature: temperature,
                condition: condition,
                err: NO_ERROR,
            });
        }

    }, function(err) {
        console.warn('Error while getting weather: ' + err.status);

        log(LOG_WEATHER_ERROR);
        callback(pos, {
            temperature: -999,
            condition: -999,
            err: WEATHER_ERROR,
        });
    });
}

function forecastioWeather(pos, callback) {
    log(LOG_FORECASTIOWEATHER);

    if (config.forecastio_api_key && config.forecastio_api_key.length > 0) {
        var url = 'https://api.forecast.io/forecast/' + config.forecastio_api_key + '/' + pos.coords.latitude + ',' + pos.coords.longitude;

        console.log(url);
        get(url, function(response) {
            var json = JSON.parse(response);

            var temperature = -999;
            var condition = -999;
            var sunrise = 1;
            var sunset = 0;

            if (json && json.currently) {
                var t = json.currently.temperature;
                if (config.temperature_units == 'imperial') {
                    temperature = Math.round(t);
                }
                else if (config.temperature_units == 'metric') {
                    temperature = Math.round(fahrenheitToCelcius(t));
                }
                else { //kelvin
                    temperature = Math.round(fahrenheitToKelvin(t));
                }

                condition = forecastioCondition(json.currently.icon);

                var current = null;
                for (var index in json.daily.data) {
                    if (!current || json.daily.data[index].time < current.time) {
                        current = json.daily.data[index];
                    }
                }

                if (current) {
                    var sunrise_date = new Date(current.sunriseTime * 1000);
                    var sunset_date = new Date(current.sunsetTime * 1000);
                    sunrise = sunrise_date.getHours() * 60 + sunrise_date.getMinutes();
                    sunset = sunset_date.getHours() * 60 + sunset_date.getMinutes();
                }

                console.log('temp:       ' + temperature);
                console.log('cond:       ' + condition);
                console.log('sunrise:    ' + sunrise);
                console.log('sunset:     ' + sunset);

                if (config.feels_like == 1) {
                    if (config.temperature_units == 'imperial') {
                        temperature = Math.round(windChill(temperature, json.currently.windSpeed));
                    }
                    else {
                        temperature = Math.round(windChill(temperature, milesperhourToKilometersperhour(json.currently.windSpeed)));
                    }

                    console.log('wind cill:  ' + temperature);
                }
                else if (config.feels_like == 2) {
                    temperature = heatIndex(temperature, json.currently.humidity * 100);
                    console.log('heat index: ' + temperature);
                }
            }

            log(LOG_WEATHER_SUCCESS);
            callback(pos, {
                temperature: temperature,
                condition: condition,
                sunrise: sunrise,
                sunset: sunset,
                err: NO_ERROR,
            });

        }, function(err) {
            console.warn('Error while getting weather: ' + err.status);

            log(LOG_WEATHER_ERROR);
            callback(pos, {
                temperature: -999,
                condition: -999,
                err: WEATHER_ERROR,
            });
        });
    }
    else {
        console.warn('No forecast.io api key');

        log(LOG_FORECASTIO_NO_KEY);
        callback(pos, {
            temperature: -999,
            condition: -999,
            err: WEATHER_ERROR,
        });
    }
}

function fetchWeather(pos, callback) {
    log(LOG_FETCH_WEATHER);
    if (config.weather_provider === OPENWEATHERMAP) {
        openWeatherMapWeather(pos, callback);
    }
    else if (config.weather_provider === YAHOO) {
        yahooWeather(pos, callback);
    }
    else if (config.weather_provider === FORECASTIO) {
        forecastioWeather(pos, callback);
    }
    else {
        yrnoWeather(pos, callback);
    }
}
