var appinfo = require('./appinfo.json');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var template = require('gulp-template');
var shell = require('gulp-shell');
var connect = require('gulp-connect');
var gopen = require('gulp-open');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var minimist = require('minimist');

var paths = {
    jslint: ['src/js/*.js', '!src/js/appinfo.js', 'gulpfile.js', 'config/*.js', '!config/colors.js'],
    pebble: {
        js: ['src/js/*.js', 'src/js/libs/*.js'],
        jsdist: 'dist/pebble/src/js/',
        jsbase: 'src/js/',
        c: ['src/*.h', 'src/*.c', 'wscript', 'appinfo.json'],
        resources: 'resources/**/*',
        fonts: [
            'config/bower_components/weather-icons/font/weathericons-regular-webfont.ttf',
            'config/bower_components/material-design-iconic-font/dist/fonts/Material-Design-Iconic-Font.ttf',
        ],
        cdist: 'dist/pebble/'
    },
    config: {
        html: 'config/*.html',
        js: [
            'config/bower_components/pebble-slate/dist/js/slate.min.js',
            'config/bower_components/angular/angular.min.js',
            'config/*.js',
        ],
        css: [
            'config/bower_components/pebble-slate/dist/css/slate.min.css',
            'config/bower_components/weather-icons/css/weather-icons.min.css',
            'config/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css',
            'config/*.css',
        ],
        fonts: [
            'config/bower_components/pebble-slate/dist/fonts/*',
            'config/bower_components/material-design-iconic-font/dist/fonts/*',
        ],
        font: [ //Avoids rewriting the css file
            'config/bower_components/weather-icons/font/*',
        ],
        dist: 'dist/config/',
    }
};

var config = minimist(process.argv.slice(2), {
    default: {
        emulator: false,
        color: false,
        ip: '192.168.1.21',
        logs: false,
        debug: false,
        config: 'http://simply-light.bhdouglass.com/',
    },
    boolean: ['emulator', 'color'],
    alias: {
        emulator: ['e', 'emu'],
        color: 'c',
        logs: 'l',
        debug: 'd',
    }
});

function installCommand(config) {
    var command = 'pebble install';
    if (config.emulator) {
        command += ' --emulator';

        if (config.color) {
            command += ' basalt';
        }
        else {
            command += ' aplite';
        }
    }
    else {
        command += ' --phone ' + config.ip;
    }

    if (config.logs) {
        command += ' --logs';
    }

    if (config.debug) {
        command += ' --debug';
    }

    return command;
}

gulp.task('serve', ['build-config', 'watch-config'], function() {
    connect.server({
        root: 'dist/config',
        ip: '0.0.0.0',
        port: 9000,
    });

    return gulp.src(paths.config.html)
        .pipe(gopen('', {
            url: 'http://localhost:9000?platform=basalt&version=' + appinfo.versionLabel
        }));
});

gulp.task('build-js', function() {
    return gulp.src(paths.config.js)
        .pipe(template({
            version: appinfo.versionLabel,
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.config.dist));
});

gulp.task('build-html', function() {
    return gulp.src(paths.config.html)
        .pipe(template({
            version: appinfo.versionLabel,
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.config.dist));
});

gulp.task('build-css', function() {
    return gulp.src(paths.config.css)
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.config.dist));
});

gulp.task('build-fonts', function() {
    return gulp.src(paths.config.fonts)
        .pipe(gulp.dest(paths.config.dist + 'fonts'));
});

gulp.task('build-font', function() {
    return gulp.src(paths.config.font)
        .pipe(gulp.dest(paths.config.dist + 'font'));
});

gulp.task('watch-config', function() {
    gulp.watch(paths.config.js, ['lint', 'build-js']);
    gulp.watch(paths.config.html, ['build-html']);
    gulp.watch(paths.config.css, ['build-css']);
    gulp.watch(paths.config.fonts, ['build-fonts']);
});

gulp.task('lint', function() {
    return gulp.src(paths.jslint)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean-config', function() {
    del.sync(paths.config.dist);
});

gulp.task('clean-pebble', function() {
    del.sync(paths.pebble.cdist);
});

gulp.task('build-pebble-js', function() {
    delete appinfo.resources;

    return gulp.src(paths.pebble.js, {base: paths.pebble.jsbase})
        .pipe(template({
            appinfo: JSON.stringify(appinfo),
            config_url: config.config,
        }))
        .pipe(gulp.dest(paths.pebble.jsdist));
});

gulp.task('build-pebble-c', function() {
    var keys = '';
    for (var key in appinfo.appKeys) {
        keys += '#define APP_KEY_' + key.toUpperCase() + ' ' + appinfo.appKeys[key] + '\n';
    }

    return gulp.src(paths.pebble.c, {base: '.'})
        .pipe(template({
            version: appinfo.versionLabel,
            keys: keys,
        }))
        .pipe(gulp.dest(paths.pebble.cdist));
});

gulp.task('build-pebble-resources', function() {
    return gulp.src(paths.pebble.resources, {base: '.'})
        .pipe(gulp.dest(paths.pebble.cdist));
});

gulp.task('build-pebble-fonts', function() {
    return gulp.src(paths.pebble.fonts)
        .pipe(gulp.dest(paths.pebble.cdist + 'resources/fonts/'));
});

gulp.task('build-config', ['lint', 'clean-config', 'build-html', 'build-js', 'build-css', 'build-fonts', 'build-font']);
gulp.task('prebuild-pebble', ['lint', 'clean-pebble', 'build-pebble-fonts', 'build-pebble-resources', 'build-pebble-c', 'build-pebble-js']);
gulp.task('build-pebble', ['prebuild-pebble'], shell.task(['cd ' + paths.pebble.cdist + ' && pebble build']));
gulp.task('install-pebble', ['build-pebble'], shell.task(['cd ' + paths.pebble.cdist + ' && ' + installCommand(config)]));
gulp.task('server-install', ['build-pebble']);
