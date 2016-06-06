# Simply Light #

A simple Pebble watchface with time, weather, and battery status.

Weather icons from <http://erikflowers.github.io/weather-icons/>. Other icons from
<http://zavoloklom.github.io/material-design-iconic-font/icons.html>.

Weather/AQI data from
[OpenWeatherMap](http://openweathermap.org/),
[Yahoo](https://www.yahoo.com/?ilc=401),
[Yr.no](http://yr.no/),
[forecast.io](http://forecast.io/),
or [AQIcn.org](http://aqicn.org/).

[Get it on your Pebble](https://apps.getpebble.com/applications/5472c040c13ebf3ddf000045)

## Translations ##

Translation have been made possible by the following people:

* Bahasa Malaysia - Adrian C
* Hungarian - Péter G.

## Build From Source ##

* Download the source code
	* `git clone https://github.com/bhdouglass/simply-light.git`
* Install build dependencies
	* `npm install -g gulp`
	* `npm install`
* Build the watchface
	* `gulp build-pebble`
* Install the watchface
	* `gulp install-pebble`

## Third Party Libraries ##

* [js-message-queue](https://github.com/smallstoneapps/js-message-queue)
* [Weatherman](https://github.com/bhdouglass/weather-man)
* [Moment.js](http://momentjs.com/)

# Simply Light Config Page #

The config page is hosted at <http://simply-light.bhdouglass.com>.

* Test the config page locally
	* `gulp serve`
* Build the config page for deployment
	* `gulp build-config`
* Deploy the config page
	* `gulp deploy`

## License ##

Copyright (C) 2016 [Brian Douglass](http://bhdouglass.com/)

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License version 3, as published by the Free
Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY
QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public
License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <http://www.gnu.org/licenses/>.
