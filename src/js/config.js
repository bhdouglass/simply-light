var constants = require('constants');
var configuration_meta = require('configMeta');

var MessageQueue = require('libs/js-message-queue');

var platform = 'aplite';
if (Pebble.getActiveWatchInfo && Pebble.getActiveWatchInfo()) {
    platform = Pebble.getActiveWatchInfo().platform;
}

var configuration = {};
for (var index in configuration_meta.config) {
    var meta = configuration_meta.config[index];

    if (meta.only != 'phone') {
        if (meta.type == 'enum' || meta.type == 'enum+string') {
            configuration[meta.name] = configuration_meta.enums[meta['enum']][meta['default']];
        }
        else {
            if (typeof meta['default'] == 'object') {
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
    window.localStorage.setItem(key, configuration[key]);
}

module.exports = {
    configuration: configuration,
    send: send,
    load: load,
    save: save,
    saveSingle: saveSingle,
};
