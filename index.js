/**
 * Index.js
 * @project Global Rockstar
 * This is the main file.
 *  @module indexjs
 */
 'use strict';
/**
 * This class requires the HTTP modules 
 * @requires http
 */
var http = require('http');
http.globalAgent.maxSockets = 200;

/**
 * This requires the following files:-
 * 1. app.js
 * 2. all the files from config
 * @requires files:app.js,all the files from config
 */
var server = require('./app'),
    config = require('./config');

if (config.trace) {
    require('debug-trace')({
        always: true,
        right: true
    });
}

/**
 * Here server starts
 **/
server.start(function () {
    console.log('server started on: ' + config.address + ':' + config.port);
});

/** @function
 * @name indexjs.startHttpsServer
 * @param {number} port - port number where http server listen
 * @requires https
 * @requires request
 * @requires fs
 * @description In this function Folowing two files are read from config/development folder : 1.key.pem & 2.cert.pem
 *
 **/

function startHttpsServer(port) {
    var request = require('request');
    var https = require('https');
    var fs = require('fs');

    var options = {
        key: fs.readFileSync('./config/development/key.pem'),
        cert: fs.readFileSync('./config/development/cert.pem')
    };

    https.createServer(options, function (req, res) {
        console.log('https-request:%s', req.url);
        req.pipe(request({ uri: 'http://localhost:' + config.port + req.url, followRedirect: false, headers: {'X-Forwarded-Host': req.headers.host, 'X-Forwarded-Proto': 'https'}})).pipe(res);
    }).listen(port, function () {
        console.log('https server started on %s', port);
    });
}

if (process.env.NODE_ENV == 'development' ||  !process.env.NODE_ENV) {
    startHttpsServer(3443);
    startHttpsServer(3444);
}
