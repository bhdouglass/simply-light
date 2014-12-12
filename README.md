# Simply Light #

[ ![Codeship Status for bhdouglass/simply-light](https://codeship.com/projects/4381e650-63ea-0132-862e-32c060907738/status?branch=master)](https://codeship.com/projects/52458)

A simple Pebble watchface with time, weather, and battery status.

Weather icons from <http://erikflowers.github.io/weather-icons/>.

Weather data from <http://openweathermap.org/>.

Get it on your Pebble - <https://apps.getpebble.com/applications/5472c040c13ebf3ddf000045>.

## Build From Source ##

* Download the source code
	* `git clone https://github.com/bhdouglass/simply-light.git`
* Install build dependencies
	* Install [UglifyJS](http://lisperator.net/uglifyjs/)
		* `npm install uglify-js -g`
	* Install [JSHint](http://jshint.com/)
		* `npm install jshint -g`
* Build watchface
	* `pebble build`
* Install watchface
	* `pebble install --phone <ip address>`
	* Optionally specify `--logs` to view the pebble console log

# Simply Light Config Page #

The config page is hosted at <http://bhdouglass.com/pebble/simply-light-config.html>.

The source for the config page is located at
<https://github.com/bhdouglass/bhdouglass.com/tree/master/src/pebble>.

## License ##

Copyright (C) 2014 [Brian Douglass](http://bhdouglass.com/)

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License version 3, as published by the Free
Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY
QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public
License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <http://www.gnu.org/licenses/>.
