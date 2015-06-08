# Simply Light #

[ ![Codeship Status for bhdouglass/simply-light](https://codeship.com/projects/4381e650-63ea-0132-862e-32c060907738/status?branch=master)](https://codeship.com/projects/52458)

A simple Pebble watchface with time, weather, and battery status.

Weather icons from <http://erikflowers.github.io/weather-icons/>. Other icons from
<http://zavoloklom.github.io/material-design-iconic-font/icons.html>.

Weather data from <http://openweathermap.org/> or <https://query.yahooapis.com/v1/public/yql>.

Get it on your Pebble - <https://apps.getpebble.com/applications/5472c040c13ebf3ddf000045>.

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

# Simply Light Config Page #

The config page is hosted at <http://simply-light.bhdouglass.com>.

* Test the config page locally
	* `gulp serve`
* Build the config page for deployment
	* `gulp build-config`

## License ##

Copyright (C) 2015 [Brian Douglass](http://bhdouglass.com/)

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License version 3, as published by the Free
Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY
QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public
License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <http://www.gnu.org/licenses/>.
