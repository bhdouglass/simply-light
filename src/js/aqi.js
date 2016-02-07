var conf = require('conf');
var util = require('util');

function fetchAirQuality(pos, data, callback) {
    var url = '';
    if (conf.config.air_quality_location) {
        url = 'http://mapidroid.aqicn.org/aqicn/services/citysearch/?android&lang=en&city=' + conf.config.air_quality_location;
    }
    else {
        //full detail: http://mapidroid.aqicn.org/aqicn/json/android/_Cw121A9IzcsrrswpS8zLTNR3zCnJz89LBAA/v9.json?cityID=USA%3APennsylvania%2FAltoona&lang=en
        url = 'http://mapidroid.aqicn.org/aqicn/services/geolocate/?autolocate&android&geo=1;' +
            pos.coords.latitude + ';' + pos.coords.longitude + ';' + pos.coords.accuracy + ';gps&lang=en';
    }

    console.log(url);
    util.get(url, function(response) {
        if (response) {
            var json = [];
            try {
                json = JSON.parse(response);
            }
            catch (e) {
                //Do nothing
            }

            if (json.length > 0) {
                console.log('aqi: ' + json[0].v);
                console.log('loc: ' + json[0].nlo);
                conf.config.last_aqi_location = json[0].nlo;
                conf.saveSingleConfig('last_aqi_location');

                data.air_quality_index = parseInt(json[0].v);
                if (!data.air_quality_index) {
                    data.air_quality_index = -999;
                    data.err = AQI_ERROR;
                }
                else {
                    data.err = NO_ERROR;
                }

                callback(pos, data);
            }
            else {
                data.air_quality_index = -999;
                data.err = AQI_ERROR;
                callback(pos, data);
            }
        }
        else {
            data.air_quality_index = -999;
            data.err = AQI_ERROR;
            callback(pos, data);
        }

    }, function(err) {
        console.warn('Error while getting air quality: ' + err.status);

        data.air_quality_index = -999;
        data.err = AQI_ERROR;
        callback(pos, data);
    });
}

module.exports.fetchAirQuality = fetchAirQuality;