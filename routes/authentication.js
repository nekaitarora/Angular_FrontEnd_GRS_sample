/**
 * The module provides routes related to  Authentication.
 * @module Routes:Auth-route
 * @requires ../lib/api
 * @requires ../config reading configuration
 * @requires q node.js library for promises
 * @requires ../lib/error this is used for printing full error stack in the console
 */
'use strict';
var config = require('../config'),
    api = require('../lib/api'),
    Q = require('q'),
    logErrorDetails = require('../lib/error'),
    request = require('request'),
    oauthget = Q.nbind(request.post, request),
    fs = require('fs'),
    shortid = require('shortid'),
    imageUpload = require('../lib/v2/uploadProfileImage'),
    getCountry = require('../helpers/getCountry');

/** @function
 * @name Routes:Auth-route.download
 * @param {string} url -Url from which Image is downloaded
 * @param {string} filename -Folder Path to right Image
 * @param {function} callback -Callback function fired after download
 * @decription Funtion to download images from a URL and right it to a folder
 **/
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
/** @function
 * @name Routes:Auth-route.RegisterWithFB
 * @param {object} req - Request object
 * @param {interface} reply - hapi reply interface
 * @param {object} body -Object containing information of the user from facebook
 * @param {string} picture -Picture name stored in DB
 * @param {string} type -Type of the user(artist or fan)
 * @decription Funtion which sets information fetched from FB and set them in session.
 * Then user is redirected to registration page according to the type he has choosen.
 **/
function RegisterWithFB(req, reply, body, picture, type) {
    var ip = req.headers['x-forwarded-for'] || req.info.remoteAddress;
    var loc = getCountry(req.resources.profile, ip);
    var registration = {};
    var redirecRoute = '/account/register/artist';
    if (loc) {
        registration['country'] = loc;
    }
    registration['email'] = body['email'];
    registration['facebookId'] = body['id'];
    registration['firstname'] = body['first_name'];
    registration['lastname'] = body['last_name'];
    registration['name'] = body['name'];
    registration['gender'] = body['gender'];
    if (picture !== '') {
        registration['picture'] = picture;
    }

    if (type !== 'artist') {
        redirecRoute = '/account/register/fan';
    }

    req.session.flash('payload', registration);
    reply().redirect(redirecRoute);
}
/** @function
 * @name Routes:Auth-route.LoginWithFB
 * @param {object} req - Request object
 * @param {interface} reply - hapi reply interface
 * @param {string} email -Email of the user
 * @decription Checks User alreday exists in our Db or not.
 * If not then redirect user to registration page
 * If exists then setting sessions for the user.
 **/
function LoginWithFB(req, reply, email) {
    if (email) {
        api.get('/user/type/' + email.toLowerCase())
        .then(function (rsl) {
            if (rsl['type'] === 'invalid') {
                /*If user is not registered in our DB*/
                reply().redirect('/account/register?q=fb');
            } else {
                /*If user is registered in our DB, So fetch details and logged in the User*/
                var url = (rsl['type'] == 'fan' ? '/fans' : '/artists') + '/fb-validate/' + email;

                api.get(url)
                .then(function (data) {
                    var profile = {
                        type: rsl['type'] == 'fan' ? 'fan' : 'artist'
                    };
                    req.session.set('type', profile.type);
                    req.session.set('profileID', data[profile.type].id);
                    req.session.set('picture', (data[profile.type].picture ? data[profile.type].picture : ""));
                    req.session.set('token', data.token);
                    req.session.flash('message', 'login-success-general');
                    req.session.set('location', (data[profile.type].country ? data[profile.type].country : 'AT'));
                    req.session.set('slug', data[profile.type].slug);

                    if (req.isComplete && !req.session.get('isComplete')) {
                        req.session.set('isComplete', true);
                    }

                    if (req.isVerified && !req.session.get('isVerified')) {
                        req.session.set('isVerified', true);
                    }
                    req.resources = req.resources || {};
                    req.resources.profile = data[profile.type];
                    req.session.set('location', data[profile.type].preferredCountry);
                    reply().redirect('/' + profile.type + 's' + '/' + data[profile.type].slug);
                })
                .fail(function (err) {
                    logErrorDetails(err);
                    reply().redirect('/');
                });
            }
        }).fail(function (err) {
            logErrorDetails(err);
            reply().redirect('/');
        });
    }else {
        reply().redirect('/account/register?q=fb');
    }
}

module.exports = function (server) {
    /**
     * @event
     * @name Routes:Auth-route.GET-account-login
     * @description path: /account/login
     * @summary It checks whether a user is already logged in or not.
     * If a user is logged in it redirects user to home page
     * but if user is not logged in It render login page (pages/login/login.jade)
     */
    server.route({
        method: 'GET',
        path: '/account/login',
        config: {
            handler: function (req, res) {
                req.session.flash('redirect_to', req.query.redirect_to);
                if (req.session.get('token')) {
                    res().redirect('/');
                }

                res.view('pages/login/login');
            }
        }
    });
    /**
     * @event
     * @name Routes:Auth-route.POST-account-login
     * @description <p>path: /artist/slug
     * <p><b>operations:</b></p>
     *   <p>-  httpMethod: 'POST'</p>
     * @summary send accessToken and refreshToken to masterlizer
     */
    server.route({
        method: 'GET',
        path: '/oauth/token',
        handler: function (req, reply) {
            var redirectUrl = req.query.redirectUrl;
            var slug = req.session.get('slug');
            request.post({
                url: redirectUrl,
                headers: {'Content-Type': 'application/json'},
                form: {"aceess_token": req.session.get('access_token'), "refresh_token": req.session.get('refresh_token'), "redirectUrl": config.redirectUrl + '/artist/' + slug, "oauthUrl": config.oauthtUrl}
            }, function (err, res, body) {
                if (err) {
                    reply().redirect('/artist/' + slug);
                }
            });
        }
    });

    /**
     * @event
     * @name Routes:Auth-route.POST-account-login
     * @description <p>path: /account/login
     * <p><b>operations:</b></p>
     *   <p>-  httpMethod: 'POST'</p>
     * @summary verify user email and password and logs in
     */
    server.route({
        method: 'POST',
        path: '/account/login',
        handler: function (req, reply) {
            req.payload.email = req.payload.email.toLowerCase();
            api.get('/user/type/' + req.payload.email)
            .then(function (rsl) {
                if (rsl['type'] === 'invalid') {
                    return reply.view('pages/login/login', {
                        message : "email"
                    });
                }else {
                    var redirect = req.session.flash('redirect_to');
                    redirect = redirect[0];

                    var profile = {
                        api: rsl['type'] == 'fan' ? 'fans' : 'artists',
                        type: rsl['type'] == 'fan' ? 'fan' : 'artist'
                    };

                    req.session.flash('type');
                    req.session.flash('type', profile['type']);
                    req.session.flash('email', req.payload.email);
                    req.session.flash('password', req.payload.password);

                    api.post('/' + profile.api + '/login', req.payload)
                    .then(function (data) {
                        req.session.set('type', profile.type);

                        req.session.set('profileID', data[profile.type].id);
                        req.session.set('picture', (data[profile.type].picture ? data[profile.type].picture : ""));
                        req.session.set('token', data.token);
                        req.session.flash('message', 'login-success-general');
                        req.session.set('location', (data[profile.type].country ? data[profile.type].country : 'AT'));
                        req.session.set('slug', data[profile.type].slug);

                        if (req.isComplete && !req.session.get('isComplete')) {
                            req.session.set('isComplete', true);
                        }

                        if (req.isVerified && !req.session.get('isVerified')) {
                            req.session.set('isVerified', true);
                        }
                        req.session.set('location', data[profile.type].preferredCountry);
                        if (profile.type == 'artist') {

                            reply().redirect(redirect || '/' + profile.api + '/' + data[profile.type].slug);

                            //request.post({
                            //    url: config.oauthtUrl + '/oauth/token',
                            //    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic MTJxYTN3c2M0NWdmOmlqazc2Ym5tbA=='},
                            //    form: {"grant_type": "password", "email": req.payload.email, "password": req.payload.password}
                            //}, function (err, res, body) {
                            //    if (err || res.statusCode === 500) {
                            //        reply().redirect(redirect || '/' + profile.api + '/' + data[profile.type].slug);
                            //    } else {
                            //        var parsebody = JSON.parse(body);
                            //        req.session.set('accesstoken', parsebody.access_token);
                            //        req.session.set('refreshtoken', parsebody.refresh_token);
                            //        req.session.set('clientId', "12qa3wsc45gf");
                            //        req.session.set('clientSecret', "ijk76b3189wsc443f24ebfanml");
                            //
                            //        reply().redirect(redirect || '/' + profile.api + '/' + data[profile.type].slug);
                            //    }
                            //});
                        } else {
                            reply().redirect(redirect || '/' + profile.api + '/' + data[profile.type].slug);
                        }
                    })
                    .fail(function (err) {
                        logErrorDetails(err);
                        if (req.payload.email == 'n') {
                            req.payload.email = '';
                        }
                        return reply.view('pages/login/login', {
                            message : "password"
                        });
                    });
                }
            })
            .fail(function (err) {
                logErrorDetails(err);
                if (req.payload.email == 'n') {
                    req.payload.email = '';
                }
                return reply.view('pages/login/login', {
                    message : "email"
                });
            });
        }
    });
    /**
     * @event
     * @name Routes:Auth-route.GET-logout
     * @description path: /logout
     * @summary loggs out user and resets all the sessions
     * @returns redirect to Home page
     */
    server.route({
        method: 'GET',
        path: '/logout',
        handler: function (req, res) {
            var artistId = req.session.get('profileID').toString();
            var type = req.session.get('type').toString();
            var templocation = req.session.get('location');
            req.session.reset();
            req.resources.profile = false;
            req.session.set('location', templocation);
            if (type == 'artist') {
                request.get({
                    url: config.oauthtUrl + '/users/logout?id=' + artistId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }, function (err, response, body) {
                    res().redirect('/');
                    if (err)
                       console.log(err);
                });
            } else {
                res().redirect('/');
            }
        }
    });
    /**
     * @event
     * @name Routes:Auth-route.FB-auth
     * @description path: /auth/facebook{type}
     * @summary Route handler for Fb authentication
     * @description Common function which connects with FB and fetch user details
     * and then either register user or simply set session for the user.
     */
    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/auth/facebook/{type}',  // The callback endpoint registered with the provider
        config: {
            auth: {
                strategy: 'facebook',
                mode: 'try'
            },
            handler: function (req, reply) {
                if (!req.auth.isAuthenticated) {
                    reply().redirect('/');
                } else {
                    var token = req.auth.credentials.token;
                    var FbId  = req.auth.credentials.profile.id;
                    request('https://graph.facebook.com/v2.4/' + FbId + '?fields=link,last_name,first_name,name,email,picture,address,location,birthday,about,bio,gender&access_token=' + token, function (error, response, body1) {
                        if (!error && response.statusCode === 200) {
                            var email = JSON.parse(body1).email;
                            if (req.params['type'] !== 'login') {
                                /*THIS function executed at the time of register with Facebook*/
                                var body = JSON.parse(body1);
                                if (body['picture']) {
                                    var picture = shortid.generate() + body['name'].replace(/ /g, "-").toLowerCase() + '.jpg';
                                    download('https://graph.facebook.com/v2.4/' + body['id'] + '/picture?width=800', 'temp/' + picture, function () {
                                        imageUpload.upload(picture);
                                        RegisterWithFB(req, reply, body, picture, req.params['type']);
                                    });
                                } else {
                                    RegisterWithFB(req, reply, body, '', req.params['type']);
                                }
                            } else {
                                /*THIS function executed at the time of Login with Facebook*/
                                LoginWithFB(req, reply, email);
                            }
                        } else {
                            reply().redirect('/');
                        }
                    });
                }
            }
        }
    });
};
