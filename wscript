#Based on http://matthewtole.com/blog/2014/07/22/simplify-your-pebble-development-with-wscript/

import json
from sh import uglifyjs
from sh import jshint

top = '.'
out = 'build'

built_js = '../src/js/pebble-js-app.js'
js_libs = [
	'../src/js/libs/js-message-queue.min.js',
]
js_sources = [
	'../src/js/appinfo.js',
	'../src/js/config.js',
	'../src/js/weather.js',
	'../src/js/listeners.js',
	'../src/js/conditions.js'
]

def concatenate_js(task):
	inputs = (input.abspath() for input in task.inputs)
	uglifyjs(*inputs, o=task.outputs[0].abspath())

def js_jshint(task):
	inputs = (input.abspath() for input in task.inputs)
	jshint(*inputs, config='jshintrc')

def generate_appinfo_js(task):
	src = task.inputs[0].abspath()
	target = task.outputs[0].abspath()
	data = open(src).read().strip()

	f = open(target, 'w')
	f.write('/* Generated from appinfo.json */\n\n')
	f.write('var appinfo = ')
	f.write(data)
	f.write(';')
	f.close()

def generate_appinfo_h(task):
	src = task.inputs[0].abspath()
	target = task.outputs[0].abspath()
	appinfo = json.load(open(src))

	f = open(target, 'w')
	f.write('#pragma once\n\n')
	f.write('/* Generated from appinfo.json */\n\n')
	f.write('#define VERSION_LABEL "%s"\n' % appinfo["versionLabel"])
	f.write('#define VERSION_CODE %d\n' % appinfo["versionCode"])
	f.write('#define UUID "%s"\n\n' % appinfo["uuid"])

	for key in appinfo['appKeys']:
		f.write('#define APP_KEY_%s %d\n' % (key.upper(), appinfo['appKeys'][key]))

	f.close()

def options(ctx):
	ctx.load('pebble_sdk')

def configure(ctx):
	ctx.load('pebble_sdk')

def build(ctx):
	ctx.load('pebble_sdk')

	#Generate app info files
	ctx(rule=generate_appinfo_js, source='../appinfo.json', target='../src/js/appinfo.js')
	ctx(rule=generate_appinfo_h, source='../appinfo.json', target='../src/appinfo.h')

	#Check and combine js
	ctx(rule=js_jshint, source=js_sources)
	ctx(rule=concatenate_js, source=' '.join(js_libs + js_sources), target=built_js)

	#Default build functions
	ctx.pbl_program(source=ctx.path.ant_glob('src/**/*.c'), target='pebble-app.elf')
	ctx.pbl_bundle(elf='pebble-app.elf', js=ctx.path.ant_glob('src/js/**/*.js'))
