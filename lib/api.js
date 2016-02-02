'use strict';

var request = require('request');
var Q = require('q');
var config = require('../config');
var get = Q.nbind(request.get, request);
var put = Q.nbind(request.put, request);
var del = Q.nbind(request.del, request);
var post = Q.nbind(request.post, request);
var fs = require('fs');
var http = require('http');
/**creating new HTTP agent*/
var pool = new http.Agent({maxSockets: 100});/**maxSockets determines how many concurrent sockets the agent can have open per origin*/
/**
 * @module lib:Api
 * @requires ../config reading configuration
 * @requires q node.js library for promises
 * @requires fs node.js library for file system handling
 * @requires http node.js library for creating a http server and an https server
 */
/** @function
* @name lib:Api.responseHandler
* @param {object} res   Response handler
* @param {object} data
* @param {date} start  todays date
* @param {string} endpoint url
* @return promise
**/
var responseHandler = function (start, endpoint) {
    return function (res, data) {
        var result = data;

        if (data.length) {
            try {
                result = JSON.parse(data);
            } catch (e) {
                result = {data: data, statusCode: res.statusCode};
            }
        }

        var dfd = Q.defer();

        if (res.statusCode < 400) {
            dfd.resolve(result);
        } else {
            dfd.reject(result);
        }

        var time = Date.now() - start;
        if (time > 1000) {
            console.warn('api:long-request:' + time + ':' + endpoint);
        }
        return dfd.promise;
    };
};

module.exports = {
    /**
 * @function
 * @name lib:Api.get
 * @description  <p>  parameters:</p>
 * @param {string} endpoint url
 * @param {string} token - Access Token Provide at the time login
 * @summary <p> Summary </p>
 *  <ul>
 * <li>GET request handler of Authorization process<li></ul>
 * @fires lib:Api:responseHandler
 * @returns  promise with result of api request <br><br><hr>
 */
    get: function (endpoint, token) {
        //console.log('api:get:' + JSON.stringify(endpoint));
        var start = Date.now();
        var options = {pool: pool};

        if (!endpoint) {
            throw new Error('endpoint is required!');
        }
        if (endpoint) {
            if (endpoint.indexOf('https://graph.facebook') > -1) {
                options.url = endpoint;
            } else {
                options.url = config.api + endpoint;

                if (token) {
                    options.headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    };
                }
            }
        }

        return get(options).spread(responseHandler(start, endpoint));
    },
    /**
     * @function
     * @name lib:Api.get
     * @description  <p>  parameters:</p>
     * @param {string} endpoint url
     * @param {object} form form post data
     * @param {string} token - Access Token Provide at the time login
     * @summary <p> Summary </p>
     *  <ul>
    * <li>POST request handler of Authorization process<li></ul>
     * @fires lib:Api:responseHandler
     * @returns  promise with result of api request <br><br><hr>
     */
    post: function (endpoint, form, token) {
        var start = Date.now();
        var options = {pool: pool};
        if (!endpoint) {
            throw new Error('endpoint is required!');
        }
        if (endpoint) {
            options.url = config.api + endpoint;
        }
        if (token) {
            options.headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            };
        }

        options.json = form;

        console.log('api:post:' + options.url, "token: " + typeof token !== "undefined");

        return post(options).spread(responseHandler(start, endpoint));
    },
    /**
    * @function
    * @name lib:Api.put
    * @description <p>  parameters:</p>
    * @param {string} endpoint url
    * @param {object} form form post data
    * @param {string} token - Access Token Provide at the time login
    * @summary <p> Summary </p>
    *  <ul>
   * <li>PUT request handler of Authorization process<li></ul>
    * @fires lib:Api:responseHandler
    * @returns  promise with result of api request <br><br><hr>
    */
    put: function (endpoint, form, token) {
        console.log('api:put:' + endpoint);
        var start = Date.now();
        var options = {pool: pool};
        if (!endpoint) {
            throw new Error('endpoint is required!');
        }
        if (endpoint) {
            options.url = config.api + endpoint;
        }
        if (token) {
            options.headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            };
        }

        options.json = form;

        return put(options).spread(responseHandler(start, endpoint));
    },
    /**
* @function
* @name lib:Api.del
* @description  <p>  parameters:</p>
* @param {string} endpoint url
* @param {string} token - Access Token Provide at the time login
* @summary <p> Summary </p>
*  <ul>
 <li>DELETE request handler of Authorization process<li></ul>
* @fires lib:Api:responseHandler
* @returns  promise with result of api request <br><br><hr>
*/
    delete: function (endpoint, token) {
        console.log('api:delete:' + endpoint);
        var start = Date.now();
        var options = {pool: pool};
        if (!endpoint) {
            throw new Error('endpoint is required!');
        }
        if (endpoint) {
            options.url = config.api + endpoint;
        }
        if (token) {
            options.headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            };
        }

        return del(options).spread(responseHandler(start, endpoint));
    },
    /**
* @function
* @name lib:Api.upload
* @description <p>  parameters:</p>
* @param {object} form form post data
* @summary <p> Summary </p>
*  <ul>
 <li>handles with the uploaded file<li></ul>
* @returns  promise with result of api request <br><br><hr>
*/
    upload: function (form) {
        var options = {pool: pool},
            endpoint = '/upload';

        if (!endpoint) {
            throw new Error('endpoint is required!');
        }
        if (endpoint) {
            options.url = config.upload + endpoint;
        }

        var dfd = Q.defer();

        var r = request.post(options.url, function optionalCallback(err, httpResponse, body) {
            if (err) {
                console.error('upload failed:', err);
                return dfd.reject(err);
            }

            console.log('Upload successful!  Server responded with:', body);
            return dfd.resolve(body);
        });

        var f = r.form();
        f.append('slug', form.file.filename);
        f.append('file', fs.createReadStream(form.file.path));
        //f.append('file', form.file);

        //return {then: function () {}};
        return dfd.promise;
    },
    /**
     * @function
     * @name lib:Api.uploadImage
     * @description <p>  parameters:</p>
     * @param {object} form form post data
     * @param {boolean} remote if True then post to Fb
     * @summary <p> Summary </p>
     *  <ul>
    * <li>handles with the uploaded Images<li></ul>
     * @returns  promise with result of api request <br><br><hr>
     */
    uploadImage: function (form, remote) {
        var options = {pool: pool},
            endpoint = '/upload/image',
            dfd, r, f;

        if (!endpoint) {
            throw new Error('endpoint is required!');
        }
        if (endpoint) {
            options.url = config.upload + endpoint;
        }

        dfd = Q.defer();
        r = request.post(options.url, function optionalCallback(err, httpResponse, body) {
            if (err) {
                console.error(err);
                return dfd.reject(err);
            }

            return dfd.resolve(body);
        });

        f = r.form();
        f.append('slug', form.slug);
        f.append('mimetype', form.file.headers['content-type']);

        if (remote) {
            f.append('file', request('https://graph.facebook.com/' + form.id + '/picture?width=9999&height=9999'));
        } else {
            f.append('file', fs.createReadStream(form.file.path));
        }
        return dfd.promise;
    },
    /**
     * @function
     * @name lib:Api.uploadSong
     * @description <p>  parameters:</p>
     * @param {object} form form post data
     * @summary <p> Summary </p>
     *  <ul>
    * <li>handles with the uploaded Songs<li></ul>
     * @returns  promise with result of api request <br><br><hr>
     */
    uploadSong: function (form) {
        var options = {pool: pool},
            endpoint = '/upload-s3/audios',
            dfd, r, f;

        if (!endpoint) {
            throw new Error('endpoint is required!');
        }
        if (endpoint) {
            options.url = config.upload + endpoint;
        }

        dfd = Q.defer();
        r = request.post(options.url, function optionalCallback(err, httpResponse, body) {
            if (err) {
                console.error(err);
                return dfd.reject(err);
            }

            return dfd.resolve(body);
        });

        f = r.form();
        f.append('originalFilename', form.file.filename);
        f.append('file', fs.createReadStream(form.file.path));

        return dfd.promise;
    }
};
