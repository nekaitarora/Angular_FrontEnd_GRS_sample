'use strict';
var i18n = require('../lib/i18n');

module.exports = function (string, data) {
    return i18n.__(string, data);
};
