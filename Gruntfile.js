'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		watch: {
			js: {
				files: ['config/*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			styles: {
				files: ['config/*.css'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['newer:jshint:all']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'config/index.html',
					'config/*.css',
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				hostname: 'localhost',
				livereload: 35729,
				base: 'config/build',
			},
			livereload: {
				options: {
					open: true,
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'config/*.js',
					'src/*.js',
				]
			}
		},

		uglify: {
			dist: {
				files: {
					'config/build/app.js': ['config/app.js']
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'config/build/main.css': ['config/main.css']
				}
			}
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
				},
				files: {
					'config/build/index.html': 'config/index.html',
				}
			}
		}
	});

	grunt.registerTask('serve', 'Serve web app', [
		'connect:livereload',
		'watch'
	]);

	grunt.registerTask('hint', [
		'jshint',
	]);

	grunt.registerTask('build', [
		'uglify',
		'cssmin',
		'htmlmin',
	]);
};
