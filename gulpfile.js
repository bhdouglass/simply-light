var appinfo = require('./appinfo.json');
var configuration_meta = require('./configuration.json');
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
var surge = require('gulp-surge');
var del = require('del');
var minimist = require('minimist');
var fs = require('fs');
var child_process = require('child_process');

var paths = {
    jslint: ['src/js/*.js', 'gulpfile.js', 'config/*.js', '!config/colors.js', '!src/js/configMeta.js', '!config/configMeta.js'],
    pebble: {
        js: ['src/js/*.js', 'src/js/libs/*.js'],
        jsdist: 'dist/pebble/src/js/',
        jsbase: 'src/js',
        c: ['src/*.h', 'src/*.c', 'wscript', 'appinfo.json'],
        resources: 'resources/**/*',
        cdist: 'dist/pebble/'
    },
    config: {
        html: 'config/*.html',
        js: [
            'config/bower_components/pebble-slate/dist/js/slate.min.js',
            'config/bower_components/angular/angular.min.js',
            'config/bower_components/angular-slate/dist/js/angular-slate.js',
            'config/*.js',
        ],
        css: [
            'config/bower_components/pebble-slate/dist/css/slate.min.css',
            'config/bower_components/weather-icons/css/weather-icons.min.css',
            'config/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css',
            'config/bower_components/angular-slate/dist/css/angular-slate.css',
            'config/bower_components/font-awesome/css/font-awesome.min.css',
            'config/*.css',
        ],
        fonts: [
            'config/bower_components/pebble-slate/dist/fonts/*',
            'config/bower_components/material-design-iconic-font/dist/fonts/*',
            'config/bower_components/font-awesome/fonts/*',
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
        aplite: false,
        basalt: true,
        chalk: false,
        diorite: false,
        emery: false,
        ip: '192.168.1.21',
        logs: false,
        config: 'http://simply-light.bhdouglass.com/',
    },
    boolean: ['emulator', 'aplite', 'basalt', 'chalk', 'diorite', 'emery'],
    alias: {
        emulator: ['e', 'emu'],
        logs: 'l',
    }
});

function installCommand(config) {
    var command = 'pebble install';
    if (config.emulator) {
        command += ' --emulator';

        if (config.aplite) {
            command += ' aplite';
        }
        else if (config.chalk) {
            command += ' chalk';
        }
        else if (config.diorite) {
            command += ' diorite';
        }
        else if (config.emery) {
            command += ' emery';
        }
        else {
            command += ' basalt';
        }
    }
    else {
        command += ' --phone ' + config.ip;
    }

    if (config.logs) {
        command += ' --logs';
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

gulp.task('server', ['serve']);

gulp.task('build-js', function() {
    return gulp.src(paths.config.js)
        .pipe(template({
            version: appinfo.versionLabel,
            configuration_meta: JSON.stringify(configuration_meta),
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
            version: appinfo.versionLabel,
            config_url: config.config,
            configuration_meta: JSON.stringify(configuration_meta),
        }))
        .pipe(gulp.dest(paths.pebble.jsdist));
});

gulp.task('build-pebble-c', function() { //TODO split gulp file into multiple files
    var keys = '';
    for (var key in appinfo.appKeys) {
        keys += '#define APP_KEY_' + key.toUpperCase() + ' ' + appinfo.appKeys[key] + '\n';
    }

    var config_struct = '';
    var config_defaults = '';
    var config_reads = '';
    var config_writes = '';
    var config_messages = '';

    for (var index in configuration_meta.config) {
        var meta = configuration_meta.config[index];

        if (meta.only != 'js') {
            //TODO handle booleans as real booleans
            config_struct += '    int ' + meta.name + ';\n';
            config_reads += '    if (persist_exists(APP_KEY_' + meta.name.toUpperCase() + ')) {\n        config.' + meta.name + ' = persist_read_int(APP_KEY_' + meta.name.toUpperCase() + ');\n    }\n\n';
            config_writes += '    persist_write_int(APP_KEY_' + meta.name.toUpperCase() + ', config.' + meta.name + ');\n';
            config_messages += '            case APP_KEY_' + meta.name.toUpperCase() + ':\n                config_update = true;\n                config.' + meta.name + ' = value;\n                break;\n\n';

            if (meta.type == 'enum' || meta.type == 'enum+string') {
                var enum_value = configuration_meta.enums[meta['enum']][meta['default']];
                config_defaults += '    config.' + meta.name + ' = ' + enum_value + ';\n';
            }
            else {
                if (typeof meta['default'] == 'object') {
                    var aplite = (meta['default'].aplite === undefined) ? null : meta['default'].aplite;
                    var basalt = (meta['default'].basalt === undefined) ? null : meta['default'].basalt;
                    var chalk = (meta['default'].chalk === undefined) ? null : meta['default'].chalk;
                    var diorite = (meta['default'].diorite === undefined) ? null : meta['default'].diorite;
                    var emery = (meta['default'].emery === undefined) ? null : meta['default'].emery;

                    config_defaults += '#ifdef PBL_PLATFORM_APLITE\n    config.' + meta.name + ' = ' + aplite + ';\n#endif\n';
                    config_defaults += '#ifdef PBL_PLATFORM_BASALT\n    config.' + meta.name + ' = ' + basalt + ';\n#endif\n';
                    config_defaults += '#ifdef PBL_PLATFORM_CHALK\n    config.' + meta.name + ' = ' + chalk + ';\n#endif\n';
                    config_defaults += '#ifdef PBL_PLATFORM_DIORITE\n    config.' + meta.name + ' = ' + diorite + ';\n#endif\n';
                    config_defaults += '#ifdef PBL_PLATFORM_EMERY\n    config.' + meta.name + ' = ' + emery + ';\n#endif\n';
                }
                else {
                    var value = (meta['default'] === undefined) ? null : meta['default'];
                    config_defaults += '    config.' + meta.name + ' = ' + value + ';\n';
                }
            }
        }
    }

    config_defaults = config_defaults.replace(/true/g, '1').replace(/false/g, '0');

    var constants = '';
    for (var name in configuration_meta.enums) {
        var e = configuration_meta.enums[name];

        for (var ekey in e) {
            var constant_key = ekey
                .replace(/-/g, '')
                .replace(/'/g, '')
                .replace(/\./g, '')
                .replace(/\//g, '')
                .replace(/\s\s+/g, ' ')
                .trim()
                .replace(/ /g, '_')
                .toUpperCase();

            constants += '#define ' + name.toUpperCase() + '_' + constant_key + ' ' + e[ekey] + '\n';
        }
    }

    return gulp.src(paths.pebble.c, {base: '.'})
        .pipe(template({
            version: appinfo.versionLabel,
            keys: keys,
            config_struct: config_struct,
            constants: constants,
            config_defaults: config_defaults,
            config_reads: config_reads,
            config_writes: config_writes,
            config_messages: config_messages,
        }))
        .pipe(gulp.dest(paths.pebble.cdist));
});

gulp.task('build-pebble-resources', function() {
    return gulp.src(paths.pebble.resources, {base: '.'})
        .pipe(gulp.dest(paths.pebble.cdist));
});

function screenshot(config, platform) {
    var command = installCommand(config).replace('install', 'screenshot');
    child_process.execSync('sleep 3s && ' + command);

    var files = fs.readdirSync('.');
    files.forEach(function(file) {
        if (file.startsWith('pebble_screenshot') && file.endsWith('.png')) {
            fs.renameSync(file, './screenshots/' + platform + '_' + file);
        }
    });
}

function screenshotAll() {
    config.basalt = false;
    config.emulator = true;
    appinfo.targetPlatforms.forEach(function(platform) {
        config[platform] = true;

        child_process.execSync('cd ' + paths.pebble.cdist + ' && ' + installCommand(config));
        screenshot(config, platform);

        config[platform] = false;
    });
}

gulp.task('build-config', ['lint', 'clean-config', 'build-html', 'build-js', 'build-css', 'build-fonts', 'build-font']);
gulp.task('prebuild-pebble', ['lint', 'clean-pebble', 'build-pebble-resources', 'build-pebble-c', 'build-pebble-js']);
gulp.task('build-pebble', ['prebuild-pebble'], shell.task(['cd ' + paths.pebble.cdist + ' && pebble build']));
gulp.task('install-pebble', ['build-pebble'], shell.task(['cd ' + paths.pebble.cdist + ' && ' + installCommand(config)]));
gulp.task('screenshot-pebble', ['install-pebble'], screenshot);

//TODO put this in the pebble template
gulp.task('screenshot-all', ['build-pebble'], screenshotAll);

gulp.task('pretty-screenshots', function() {
    for (var i = 0; i < 4; i++) {
        child_process.execSync('gulp prebuild-pebble && sed -i "s/\\/\\/SCREENSHOT_' + i + '//g" ' + paths.pebble.cdist + 'src/*.c'); //TODO this is very hacky :/
        child_process.execSync('cd ' + paths.pebble.cdist + ' && pebble build');
        screenshotAll(); //TODO pass i for filename
    }
});

gulp.task('server-install', ['build-pebble']);

gulp.task('deploy-config', ['build-config'], function() {
    return surge({
        project: paths.config.dist,
        domain: fs.readFileSync('CNAME', 'utf-8'),
    });
});

gulp.task('deploy-config-dev', ['build-config'], function() {
    return surge({
        project: paths.config.dist,
        domain: 'dev-' + fs.readFileSync('CNAME', 'utf-8'),
    });
});
