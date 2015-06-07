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

var paths = {
    jslint: ['src/js/*.js', '!src/js/appinfo.js', 'gulpfile.js', 'config/*.js'],
    pebble: {
        js: ['src/js/*.js', 'src/js/libs/*.js'],
        jsdist: 'dist/src/js/',
        c: ['src/*.h', 'src/*.c', 'wscript', 'appinfo.json'],
        resources: 'resources/**/*',
        cdist: 'dist/'
    },
    config: {
        html: 'config/*.html',
        js: 'config/*.js',
        css: 'config/*.css',
        dist: 'dist/config/'
    }
};

gulp.task('serve', function() {
    connect.server({
        root: 'config',
        port: 9000
    });

    return gulp.src(paths.config.html)
        .pipe(gopen('', {
            url: 'http://localhost:9000?version=' + appinfo.versionLabel
        }));
});

gulp.task('serve-dist', ['build-config'], function() {
    connect.server({
        root: 'dist/config',
        port: 9001
    });

    return gulp.src(paths.config.html)
        .pipe(gopen('', {
            url: 'http://localhost:9001?version=' + appinfo.versionLabel
        }));
});

gulp.task('build-js', function() {
    return gulp.src(paths.config.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
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

gulp.task('lint', function() {
    return gulp.src(paths.jslint)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
    del.sync(paths.pebble.cdist);
});

gulp.task('build-pebble-js', function() {
    delete appinfo.resources;

    return gulp.src(paths.pebble.js)
        .pipe(template({appinfo: JSON.stringify(appinfo)}))
        .pipe(concat('pebble-js-app.js'))
        .pipe(uglify())
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

gulp.task('build-config', ['lint', 'clean', 'build-html', 'build-js', 'build-css']);
gulp.task('build-pebble', ['lint', 'clean', 'build-pebble-resources', 'build-pebble-c', 'build-pebble-js'], shell.task(['cd dist && pebble build']));
gulp.task('install-pebble', ['build-pebble'], shell.task(['cd dist && pebble install --phone 192.168.1.133 --logs']));