#Improvements based on this code - http://matthewtole.com/blog/2014/07/22/simplify-your-pebble-development-with-wscript/

from sh import uglifyjs
from sh import jshint

top = '.'
out = 'build'

built_js = '../src/js/pebble-js-app.js'
js_libs = []
js_sources = [
	'../src/js/main.js',
]

def concatenate_js(task):
	inputs = (input.abspath() for input in task.inputs)
	uglifyjs(*inputs, o=task.outputs[0].abspath())

def js_jshint(task):
	inputs = (input.abspath() for input in task.inputs)
	jshint(*inputs, config='jshintrc')

def options(ctx):
	ctx.load('pebble_sdk')

def configure(ctx):
	ctx.load('pebble_sdk')

def build(ctx):
	ctx.load('pebble_sdk')

	#Custom build functions
	ctx(rule=js_jshint, source=js_sources)
	ctx(rule=concatenate_js, source=' '.join(js_libs + js_sources), target=built_js)

	#Default build functions
	ctx.pbl_program(source=ctx.path.ant_glob('src/**/*.c'),
					target='pebble-app.elf')

	ctx.pbl_bundle(elf='pebble-app.elf',
				js=ctx.path.ant_glob('src/js/**/*.js'))
