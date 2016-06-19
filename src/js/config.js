var constants = require('./constants');
var configuration_meta = require('./configMeta');

var MessageQueue = require('./libs/js-message-queue');

var platform = 'aplite';
if (Pebble.getActiveWatchInfo && Pebble.getActiveWatchInfo()) {
    platform = Pebble.getActiveWatchInfo().platform;
}

var configuration = {};
for (var index in configuration_meta.config) {
    var meta = configuration_meta.config[index];

    if (meta.only != 'pebble') {
        if (meta.type == 'enum' || meta.type == 'enum+string') {
            configuration[meta.name] = configuration_meta.enums[meta['enum']][meta['default']];
        }
        else {
            if (typeof meta['default'] == 'object' && meta['default'] !== null) {
                configuration[meta.name] = (meta['default'][platform] === undefined) ? null : meta['default'][platform];
            }
            else {
                configuration[meta.name] = (meta['default'] === undefined) ? null : meta['default'];
            }
        }
    }
}

function ack(e) {
    console.log('Successfully delivered config message with transactionId=' + e.data.transactionId);
}

function nack(e) {
    console.log('Unable to deliver config message with transactionId=' + e.data.transactionId + ', error is: ' + e.error.message);
}

function send() {
    var message = {};
    for (var index in configuration_meta.config) {
        var meta = configuration_meta.config[index];

        if (!meta.only) {
            if (meta.type == 'bool') {
                message[meta.name] = configuration[meta.name] ? 1 : 0;
            }
            else {
                message[meta.name] = configuration[meta.name];
            }
        }
    }

    MessageQueue.sendAppMessage(message, ack, nack);
}

function load() {
    for (var index in configuration_meta.config) {
        var meta = configuration_meta.config[index];

        var value = window.localStorage.getItem(meta.name);
        if (value !== null) {
            if (meta.type == 'int' || meta.type == 'enum') { //TODO check if it's a valid enum
                configuration[meta.name] = parseInt(value);
            }
            else if (meta.type == 'bool') {
                configuration[meta.name] = (value == '1' || value == 'true');
            }
            else if (meta.type == 'obj') {
                try {
                    configuration[meta.name] = JSON.parse(value);
                }
                catch (err) {
                    configuration[meta.name] = {};
                }
            }
            else {
                configuration[meta.name] = value;
            }
        }
    }
}

function save(new_configuration) {
    for (var key in new_configuration) {
        configuration[key] = new_configuration[key];
        saveSingle(key);
    }

    console.log(JSON.stringify(configuration));
}

function saveSingle(key) {
    var type = 'int';
    for (var index in configuration_meta.config) {
        var meta = configuration_meta.config[index];

        if (key == meta.name) {
            type = meta.type;
        }
    }

    var value = configuration[key];
    if (type == 'obj') {
        value = JSON.stringify(value);
    }

    window.localStorage.setItem(key, value);
}

module.exports = {
    configuration: configuration,
    send: send,
    load: load,
    save: save,
    saveSingle: saveSingle,
};
