/**@module Controllers:Accountjs
 * @description Handels user profile and his uploads
 * @requires hapi
 * @requires ../lib/api
 * @requires ../config reading configuration
 * @requires q node.js library for promises
 * @requires ../lib/converterrors Handles with error
 * @requires image-size node.js library for get dimensions of any image file
 * @requires lodash node.js library for provides clean, performant methods for manipulating objects and collections.
 **/
'use strict';

var api = require('../lib/api'),
    Hapi = require('hapi'),
    config = require('../config'),
    Q = require('q'),
    convertErrors = require('../lib/converterrors'),
    size = require('image-size'),
    _ = require('lodash'),
    getCountry = require('../helpers/getCountry'),
    logErrorDetails = require('../lib/error'),
    cachedResource = require('../lib/cached-ressoure'),
    Boom = require('boom');

/** @function
    @name Controllers:Accountjs.updateProfile
    @param {object} payload - The Request Payload
    @param {string} token - token provided to user when he logged in the system in
*/
var updateProfile = function (payload, token) {
    payload.year = parseFloat(payload.year);
    return api.put('/profile', payload, token);
};
/** @function
    @name Controllers:Accountjs.handleUploadSong
    @description handler for uploaded songs .
    @param {object} file - The Request File Payload
*/
var handleUploadSong = function (file) {
    var dfd = Q.defer();

    if (file) {
        if (file.headers['content-type'].indexOf('mp3') < 0 && file.headers['content-type'].indexOf('mpeg') < 0) {
            var error = Boom.badRequest('only mp3s allowed');
            error.output.statusCode = 499;
            error.reformat();
            dfd.resolve(error.output);
            return dfd.promise;
        }

        return api.uploadSong({
            slug: file.filename,
            file: file
        });
    } else {
        dfd.resolve();
        return dfd.promise;
    }
};


var _getCountry = require('../helpers/getCountry');
/**
    @function
    @name Controllers:Accountjs.getCountry
    @description Sets the location of user in sessions.
    @param {object} req - The Request object
*/
var getCountry = function (req) {
    return req.session.get('location') || _getCountry(req.resources.profile, req.resources.ip);
};
/**
    @function
    @name Controllers:Accountjs.handleUpload
    @description handler for uploaded Images .
    @param {object} file - The Request image File Payload
    @param {object} slug
*/
var handleUpload = function (file, slug) {
    var dfd = Q.defer();
    //size(file.path));
    if (file) {
        if (file.headers['content-type'].indexOf('image') !== 0) {
            var error = Boom.badRequest('invalid image!');
            error.output.statusCode = 499;
            error.reformat();
            dfd.reject(error.output);
            return dfd.promise;
        } else if (size(file.path).width < 500 && size(file.path).height < 500) {
            var error1 = Boom.badRequest('image too small!');
            error1.output.statusCode = 498;
            error1.reformat();
            dfd.reject(error1.output);
            return dfd.promise;
        }

        return api.uploadImage({
            file: file,
            slug: slug
        });
    } else {
        dfd.resolve();
        return dfd.promise;
    }
};

module.exports = {
    /**
    @function
    @name Controllers:Accountjs.getProfile
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @param {object} server - Server object
     * @description It checks isComplete, isVerified, Token, type(FAN or ARTIST) from session
     * then renders pages/artists/edit-artist OR pages/fan/edit-fan view according to type
    **/
    getProfile: function (req, reply, server) {
        var template, token;
        // Store the session token in the variable
        token = req.session.get('token');
        /** Checking isComplete property is set in session or not **/
        if (req.isComplete && !req.session.get('isComplete')) {
            req.session.set('isComplete', true);
        }
        /** Checking isVerified property is set in session or not **/
        if (req.isVerified && !req.session.get('isVerified')) {
            req.session.set('isVerified', true);
        }
        /** Checking Token is set in session or not **/
        if (!token) {
            reply().redirect('/');
        }
        if (req.session.get('type') == 'fan') {
            template = 'fan';
        } else {
            template = 'artist';
        }
        var gender = [{value: '', text: ''}, {value: 'male', text: "Male"}, {value: 'female', text: "Female"}, {value: 'prefer_not_to_say', text: "Prefer not to say"}];
        // send request's to get the aritst info that he enter during the login
        Q.all([
            api.get('/profile', token),
            api.get('/config/genres'),
            api.get('/config/countries')
        ]).spread(function (profile, genres, countries) {
            var user = req.session.flash('payload')[0] || profile;
            var country = [];
            var genres_music = [];
            var genres_own = [];
            var genres_fan = [];
            var edit_gender = [];
            var uploadImage;
            genres_own.push({value: '', text: ''});
            genres_music.push({value: '', text: ''});
            _.each(countries, function (object) {
                var obc = {};
                obc['value'] = object.code;
                obc['text']  = object.name;
                if (user.country == object.code) {
                    obc['selected'] = 'true';
                }
                country.push(obc);
            });
            _.each(gender, function (object) {
                var obc = {};
                obc['value'] = object.value;
                obc['text'] = object.text;
                if (object.value == user.gender) {
                    obc['selected'] = 'true';
                }
                edit_gender.push(obc);
            });
            _.each(genres, function (val) {
                var obc = {};
                obc['value'] = val;
                obc['text'] = val;
                if (user.genres_music &&  user.genres_music.indexOf(val) > -1) {
                    obc['selected'] = 'true';
                }
                genres_music.push(obc);
                obc = {};
                obc['value'] = val;
                obc['text'] = val;
                if (user.genres_own &&  user.genres_own.indexOf(val) > -1) {
                    obc['selected'] = 'true';
                }
                genres_own.push(obc);
                obc = {};
                obc['value'] = val;
                obc['text'] = val;
                if (user.genres &&  user.genres.indexOf(val) > -1) {
                    obc['selected'] = 'true';
                }
                genres_fan.push(obc);

            });
            // check user uploaded image or not
            if (user.picture && user.picture !== '') {
                uploadImage = user.picture;
            }
            // storing the response in the data
            var data = {
                user: user,
                error: req.session.flash('error')[0] || false,
                genres_music: genres_music,
                genres_own: genres_own,
                genres_fan: genres_fan,
                country: country,
                edit_gender: edit_gender,
                message: req.session.flash('message'),
                uploadImage: uploadImage
            };
            if (template == 'artist') {
                template = template + 's';
            }
            reply.view('pages/' + template + '/edit-' + template, data);
        })
        .fail(function (err) {
            logErrorDetails(err);
        });
    },
    /**
     * @function
     * @name  Controllers:Accountjs.updateProfile
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description This function is used to submit and update the information of the user
     *
    **/
    updateProfile: function (req, reply) {
        // check user chenge image or not
        if (req.session.get('upload-wizard.image-draft')) {
            req.payload.picture = req.session.get('upload-wizard.image-draft').uniqueFileName;
        }else {
            req.payload.picture = req.resources.profile.picture;
        }
        var template, token;
        // Store the session token in variable
        token = req.session.get('token');
        // Check if the user is loged in or not
        if (!token) {
            reply().redirect('/');
        }
        // check the type of the user
        if (req.session.get('type') == 'fan') {
            template = 'fan';
        } else {
            template = 'artist';
        }
        // check the genres this is for fan
        if (req.payload.genres && !req.payload.genres.push) {
            req.payload.genres = [req.payload.genres];
        }
        //check the genres music this is for artist
        if (req.payload.genres_music && !req.payload.genres_music.push) {
            req.payload.genres_music = [req.payload.genres_music];
        }
        //check the genres own this is for artist
        if (req.payload.genres_own && !req.payload.genres_own.push) {
            req.payload.genres_own = [req.payload.genres_own];
        }
        // check if the user is fan or the artist
        var endpoint = template == 'fan' ? 'fans' : 'artists';
        Q.allSettled([
            // Valid the data send submit by the user
            api.put('/' + endpoint + '/validate', req.payload, token)
        ])
            .then(function (data) {
                // if the one of the request is fail
                if (data.state == 'rejected') {
                    // we modify and merge our errors
                    var err = {};
                    if (data && data.state == 'rejected') {
                        err = convertErrors(data.reason);
                    }
                    req.session.flash('error', err);
                    req.session.flash('payload', req.payload);
                    return reply().redirect('/account/profile');
                } else {
                    return updateProfile(req.payload, token);
                }
            })
            .then(function (data) {
                // if there is no error then this section run
                var profile = req.resources.profile;
                // assign the updated name to the object profile
                if (data.name) {
                    profile.name = data.name;
                }
                // assign the updated firstname to the object profile
                if (data.firstname) {
                    profile.firstname = data.firstname;
                }
                // assign the updated lastname to the object profile
                if (data.lastname) {
                    profile.lastname = data.lastname;
                }
                // assign the updated picture to the object profile
                if (data.picture) {
                    profile.picture = data.picture;
                }
                // assign the updated country to the object profile
                if (data.country) {
                    req.session.set('location', data.country);
                    profile.country = data.country;
                }

                req.resources.profile = profile;
                req.session.flash('message', 'Your profile have Updated succesfully');
                reply().redirect('/account/profile');
            })
            .fail(function (err) {
                req.session.flash('error', err.data[0].message);
                reply().redirect('/account/profile');
            })
            .fail(function (err) {
                req.session.flash('error', err.data[0].message);
                reply().redirect('/account/profile');
            });
    },
    /**
     * @function
       @name  Controllers:Accountjs.updatePayPalAccount
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description Update paypal Account information of user
    **/
    updatePayPalAccount: function (req, reply) {
        var token = req.session.get('token');

        return api.put('/artists/' + req.resources.profile._id + '/update-paypal-account', {
            paypal_firstname: req.payload.paypal_firstname,
            paypal_lastname: req.payload.paypal_lastname,
            paypal_email: req.payload.paypal_email,
            paypal_currency: req.payload.paypal_currency,
            paypal_verified: req.payload.paypal_verified
        }, req.session.get('token'))
            .then(function (result) {
                reply().code(200);
            })
            .fail(function (err) {
                logErrorDetails(err);
                reply(err);
            });
    },
    /**
    @function
    @name Controllers:Accountjs.fanRegisterGet
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description It checks whether the user is already logged in then redirects to /
     * else checks for errors and payload in session and renders
     * pages/register/fan to register a fan
    **/
    fanRegisterGet: function (req, reply) {
        if (req.session.get('token')) {
            reply().redirect('/');
        }
        var errorMessage;
        var error = req.session.flash('error');
        if (!error.length) {
            errorMessage = false;
        } else {
            errorMessage = error[0].data[0].message;
        }

        var payload = req.session.flash('payload');
        if (!payload.length) {
            payload = {};
        } else {
            payload = payload[0];
        }

        var endpoints = [
            cachedResource('/config/countries'),
            cachedResource('/config/genres')
        ];

        Q.all(endpoints).spread(function (countries, genres) {
                var country = [];
                var gener = [];
                gener.push({value: '', text: ''});

                _.each(countries, function (object) {
                    var obc = {};
                    obc['value'] = object.code;
                    obc['text']  = object.name;
                    if (payload.country === object.code) {
                        obc['selected'] = true;
                    }
                    country.push(obc);
                });

                _.each(genres, function (val) {
                    var obc = {};
                    obc['value'] = val;
                    obc['text'] = val;
                    if (payload.genres) {
                        if (payload.genres.indexOf(val) > -1) {
                            obc['selected'] = true;
                        }
                    }
                    gener.push(obc);
                });
                if (payload == {}) {
                    var location = getCountry(req.resources.profile, req.headers['x-forwarded-for'] || req.info.remoteAddress);
                    payload.country = location;
                }
                reply.view('pages/register/fan', {
                    country : country,
                    gener   : gener,
                    registration: payload,
                    errorMessage: errorMessage
                });

            }).fail(function (err) {
                logErrorDetails(err);
                reply(err);
            });
    },
    /**
    @function
    @name Controllers:Accountjs.fanRegisterPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description posts fan registration data using post api handler of /fans/register
     * on success redirects to fan's profile /fans/{fan-slug}
     * else redirects to the same page with error message
    **/
    fanRegisterPost: function (req, reply) {
        /*if (req.payload.genres && !req.payload.genres.push) {
            req.payload.genres = [req.payload.genres];
        }*/
        if (req.payload.genres) {
            req.payload.genres = typeof (req.payload.genres) === 'string' ? [req.payload.genres] : req.payload.genres;
        }
        req.payload.picture = req.session.get('upload-wizard.image-draft') ? req.session.get('upload-wizard.image-draft').uniqueFileName : req.payload.picture;
        req.payload.toc = "on";
        api.post('/fans/register', req.payload)
        .then(function (data) {
            var elastic_data = data;
            elastic_data.userType = 'fan';
            req.session.set('type', 'fan');
            req.session.set('token', data.token);
            req.session.set('profileID', data['fan'].id);
            req.session.set('picture', (data['fan'].picture ? data['fan'].picture : ""));
            req.session.set('location', data['fan'].country);
            api.post('/elastic/artistOrFan/register', elastic_data)
            .then(function (data1) {
                reply().redirect('/fans/' + data['fan'].slug);
            })
            .fail(function (err) {
                console.log(err); reply().redirect('/fans/' + data['fan'].slug);
            });
            // reply().redirect('/fans/' + data['fan'].slug);
        })
        .fail(function (err) {
            req.session.flash('payload', req.payload);
            req.session.flash('error', err);
            logErrorDetails(err);
            reply().redirect('/account/register/fan');
        })
        .fail(function (err) {
            logErrorDetails(err);
        });
    },
    /**
    @function
    @name Controllers:Accountjs.artistRegisterGet
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description It checks whether the user is already logged in then redirects to /
     * else checks for errors and payload in session and renders
     * pages/register/artist to register an artist
    **/
    artistRegisterGet: function (req, reply) {
        if (req.session.get('token')) {
            reply().redirect('/');
        }
        var errorMessage;
        var error = req.session.flash('error');
        if (!error.length) {
            errorMessage = false;
        } else {
            errorMessage = error[0].data[0].message;
        }

        var payload = req.session.flash('payload');
        if (!payload.length) {
            payload = {};
        } else {
            payload = payload[0];
        }
        var endpoints = [
            cachedResource('/config/countries'),
            cachedResource('/config/genres')
        ];

        Q.all(endpoints).spread(function (countries, genres) {
            var country = [];
            var gener_own = [];
            var gener_music = [];
            gener_own.push({value: '', text: ''});
            gener_music.push({value: '', text: ''});

            _.each(countries, function (object) {
                var obc = {};
                obc['value'] = object.code;
                obc['text']  = object.name;
                if (payload.country === object.code) {
                    obc['selected'] = true;
                }
                country.push(obc);
            });

            _.each(genres, function (val) {
                var obc = {};
                obc['value'] = val;
                obc['text'] = val;
                if (payload.genres_own) {
                    if (payload.genres_own.indexOf(val) > -1) {
                        obc['selected'] = true;
                    }
                }
                gener_own.push(obc);

                var obc1 = {};
                obc1['value'] = val;
                obc1['text'] = val;
                if (payload.genres_music) {
                    if (payload.genres_music.indexOf(val) > -1) {
                        obc1['selected'] = true;
                    }
                }
                gener_music.push(obc1);
            });
            if (payload == {}) {
                var location = getCountry(req.resources.profile, req.headers['x-forwarded-for'] || req.info.remoteAddress);
                payload.country = location;
            }
            reply.view('pages/register/artist', {
                country : country,
                gener_own : gener_own,
                gener_music : gener_music,
                registration: payload,
                errorMessage: errorMessage
            });

        }).fail(function (err) {
            logErrorDetails(err);
            reply(err);
        });
    },
    /**
    @function
    @name Controllers:Accountjs.artistRegisterPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description validates the payload using post api handler of /artists/register/validate and
     * posts artist registration data using post api handler of /artists/register
     * on success redirects to /setup/services
     * else redirects to the same page with error message
    **/
    artistRegisterPost: function (req, reply) {
        if (req.payload.genres_music) {
            req.payload.genres_music = typeof (req.payload.genres_music) === 'string' ? [req.payload.genres_music] : req.payload.genres_music;
        }
        if (req.payload.genres_own) {
            req.payload.genres_own = typeof (req.payload.genres_own) === 'string' ? [req.payload.genres_own] : req.payload.genres_own;
        }
        req.payload.picture = req.session.get('upload-wizard.image-draft') ? req.session.get('upload-wizard.image-draft').uniqueFileName : req.payload.picture;
        req.payload.toc = "on";
        api.post('/artists/register/validate', req.payload)
            .then(function (artist) {
                if (artist.state == 'rejected') {
                    var err = {};
                    if (artist && artist.state == 'rejected') {
                        err = convertErrors(artist.reason);
                    }

                    req.session.flash('error', err);
                    req.session.flash('payload', req.payload);

                    return reply().redirect('/account/register/artist');
                } else {
                    api.post('/artists/register', req.payload)
                    .then(function (data) {
                        var elastic_data = data;
                        elastic_data.userType = 'artist';
                        req.session.set('type', 'artist');
                        req.session.set('token', data.token);
                        req.session.set('profileID', data['artist'].id);
                        req.session.set('picture', (data['artist'].picture ? data['artist'].picture : ""));
                        req.session.set('location', data['artist'].country);
                        api.post('/elastic/artistOrFan/register', elastic_data);
                        reply().redirect('/setup/services');
                    })
                    .fail(function (err) {
                        req.session.flash('payload', req.payload);
                        req.session.flash('error', err);
                        logErrorDetails(err);
                        reply().redirect('/account/register/artist');
                    });
                }
            })
            .fail(function (error) {
                req.session.flash('payload', req.payload);
                req.session.flash('error', error);
                reply().redirect('/account/register/artist');
            });
    },
    /**
    @function
    @name Controllers:Accountjs.changePasswordGet
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description if req.session.token token is not present then redirects to /
     * Fetches data using get api handler of /profile
    **/
    changePasswordGet: function (req, reply) {
        var token = req.session.get('token');

        if (!token) {
            reply().redirect('/');
        }

        api.get('/profile', token)
        .then(function (data) {
            reply.view('pages/account/change-password', {
                user: data,
                error: false
            });
        }).fail(function (err) {
            logErrorDetails(err);
        });
    },
    /**
    @function
    @name Controllers:Accountjs.changePasswordPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description if req.session.token token is not present then redirects to /
     * Updates password using put api handler of /profile
    **/
    changePasswordPost: function (req, reply) {
        var token = req.session.get('token');

        if (!token) {
            reply().redirect('/');
        }

        api.put('/profile/change_password', req.payload, token)
            .then(function (data) {
                req.session.flash('message', 'you have succesfully change password');
                reply.view('pages/account/change-password', {
                    user: req.payload,
                    error: false,
                    message: req.session.flash('message')
                });
                req.session.reset();
                req.resources.profile = false;
            })
            .fail(function (err) {
                logErrorDetails(err);
                reply.view('pages/account/change-password', {
                    user: req.payload,
                    error: convertErrors(err)
                });
            });
    },
    /**
    @function
    @name Controllers:Accountjs.deleteAccountGet
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description if req.session.token token is not present then redirects to /
     * else renders page pages/account/delete
    **/
    deleteAccountGet: function (req, reply, server) {
        if (!req.session.get('token')) {
            reply().redirect('/');
        }

        reply.view('pages/account/delete');
    },
    /**
    @function
    @name Controllers:Accountjs.deleteAccountPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description if req.session.token token is not present then redirects to /
     * Updates( profile state = deleted) data using put api handler of /profile/state
     * if fails redirects '/account/profile/delete'
     * else redirects '/' on success
    **/
    deleteAccountPost: function (req, reply) {
        var token = req.session.get('token');

        if (!token) {
            reply().redirect('/');
        }

        api.put('/profile/state', {
            state: 'deleted'
        }, token)
        .then(function (data) {
            req.session.reset();
            req.resources.profile = false;
            reply().redirect('/');
        })
        .fail(function (err) {
            logErrorDetails(err);
            reply().redirect('/account/profile/delete');
        });
    },
    /**
    @function
    @name Controllers:Accountjs.forgotPasswordArtistGet
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description checks whether the user is logged in
     * then get forgot Password page for user type artist
     * renders view -> pages/account/forgotpassword-artist
    **/
    forgotPasswordArtistGet: function (req, reply) {
        if (req.session.get('token')) {
            reply().redirect('/') ;
        }

        reply.view('pages/account/forgotpassword-artist');
    },
    /**
    @function
    @name Controllers:Accountjs.forgotPasswordArtistPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description changes Password for user type artist
     * if success redirect to /account/login
     * if fails renders 'pages/account/forgotpassword-artist' view
    **/
    forgotPasswordArtistPost: function (req, reply) {
        api.post('/artists/forgot-password', req.payload)
        .then(function (data) {
            req.session.flash('message', 'forgot-password-success-general');
            reply.view('pages/account/forgotpassword-artist', {
                success: true
            }) ;
        })
        .fail(function (err) {
            logErrorDetails(err);
            reply.view('pages/account/forgotpassword-artist', {
                error: true
            }) ;
        });
    },
    /**
    @function
    @name Controllers:Accountjs.forgotPasswordFanGet
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description checks whether the user is logged in
     * get forgot Password page for user type fan
     * redirect to pages/account/forgotpassword-fan
    **/
    forgotPasswordFanGet: function (req, reply) {
        if (req.session.get('token')) {
            reply().redirect('/') ;
        }

        reply.view('pages/account/forgotpassword-fan');
    },
    /**
    @function
    @name Controllers:Accountjs.forgotPasswordFanPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description changes Password for user type fan
     * if success redirect to /account/login
     * if fails renders 'pages/account/forgotpassword-fan' view
    **/
    forgotPasswordFanPost: function (req, reply) {
        api.post('/fans/forgot-password', req.payload)
        .then(function (data) {
            req.session.flash('message', 'forgot-password-success-general');
            reply.view('pages/account/forgotpassword-fan', {
                success: true
            }) ;
        })
        .fail(function (err) {
            logErrorDetails(err);
            reply.view('pages/account/forgotpassword-fan', {
                error: true
            }) ;
        })
        .fail(function (err) {
            logErrorDetails(err);
        }) ;
    },
    /**
     * @function
     * @name  Controllers:Accountjs.updateAdditionalInfo
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description This function is used to submit and update addtional information of the user
     *
    **/
    updateAdditionalInfo: function (req, reply) {
        // check user chenge image or not
        req.payload.name = (req.resources.profile.name ? req.resources.profile.name : (req.resources.profile.firstname + ' ' + req.resources.profile.lastname));
        req.payload.picture = req.resources.profile.picture;
        req.payload.firstname = req.resources.profile.firstname;
        req.payload.lastname = req.resources.profile.lastname;
        req.payload.email = req.resources.profile.email;
        req.payload.country = req.resources.profile.country;
        req.payload.gender = req.resources.profile.gender;
        req.payload.birthdate = req.resources.profile.birthdate;
        req.payload.city = req.resources.profile.city;
        req.payload.genres_music = req.resources.profile.genres_music;
        req.payload.genres_own = req.resources.profile.genres_own;
        var template, token;
        // Store the session token in variable
        token = req.session.get('token');
        // Check if the user is loged in or not
        if (!token) {
            reply().redirect('/');
        }
        // check the type of the user
        if (req.session.get('type') == 'fan') {
            template = 'fan';
        } else {
            template = 'artist';
        }
        // check the genres this is for fan
        if (req.payload.genres && !req.payload.genres.push) {
            req.payload.genres = [req.payload.genres];
        }
        //check the genres music this is for artist
        if (req.payload.genres_music && !req.payload.genres_music.push) {
            req.payload.genres_music = [req.payload.genres_music];
        }
        //check the genres own this is for artist
        if (req.payload.genres_own && !req.payload.genres_own.push) {
            req.payload.genres_own = [req.payload.genres_own];
        }
        // check if the user is fan or the artist
        var endpoint = template == 'fan' ? 'fans' : 'artists';
        Q.allSettled([
            // Valid the data send submit by the user
            api.put('/' + endpoint + '/validate', req.payload, token)
        ])
            .then(function (data) {
                // if the one of the request is fail
                if (data.state == 'rejected') {
                    // we modify and merge our errors
                    var err = {};
                    if (data && data.state == 'rejected') {
                        err = convertErrors(data.reason);
                    }
                    req.session.flash('error', err);
                    req.session.flash('payload', req.payload);
                    return reply().redirect('/account/profile');
                } else {
                    return updateProfile(req.payload, token);
                }
            })
            .then(function (data) {
                // if there is no error then this section run
                var profile = req.resources.profile;
                // assign the updated name to the object profile
                if (data.name) {
                    profile.name = data.name;
                }
                // assign the updated firstname to the object profile
                if (data.firstname) {
                    profile.firstname = data.firstname;
                }
                // assign the updated lastname to the object profile
                if (data.lastname) {
                    profile.lastname = data.lastname;
                }
                // assign the updated picture to the object profile
                if (data.picture) {
                    profile.picture = data.picture;
                }
                req.resources.profile = profile;

                req.session.flash('message', 'Your profile have Updated succesfully');
                reply().redirect('/account/profile');
            })
            .fail(function (err) {
                req.session.flash('error', err.data[0].message);
                reply().redirect('/account/profile');
            })
            .fail(function (err) {
                req.session.flash('error', err.data[0].message);
                reply().redirect('/account/profile');
            });
    },
    /**
     @function
     @name  Controllers:Accountjs.participateView
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @param {object} server - Server object
     * @description Checks  isVerified, Token, type(FAN or ARTIST) from session
     * then renders account if type = FAN OR profile/participate-contest view if type = ARTIST
    **/
    participateView: function (req, reply, server) {
        if (!req.isVerified) {
            reply().redirect('/account');
        }
        var token = req.session.get('token'),
            payload = req.session.flash('payload')[0] || {};

        if (!token) {
            reply().redirect('/');
        }
        if (req.session.get('type') == 'fan') {
            reply().redirect('/account');
        }
        //if (payload && payload.contact)
        //payload.profile.contact = payload.contact;

        if (payload && payload.addVideo) {
            payload.video._id = payload.addVideo.id;
        }
        Q.all([
            api.get('/profile', token),
            api.get('/config/genres'),
            api.get('/config/countries'),
            api.get('/config/currencies'),
            api.get('/profile/videos', token)
        ]).spread(function (profile, genres, countries, currencies, videos) {
            var viewData = {
                metatags: {
                    title: server.i18n.__('meta-title-participate-contest')
                },
                user: payload.profile || profile,
                genres: genres,
                countries: countries,
                song: payload.song || {},
                video: payload.video || _.filter(videos, function (video) {
                    return video.category == 'call';
                })[0] || {},
                hasActiveProject: req.resources.hasActiveProject,
                error: req.session.flash('error')[0] || false
            };

            if (!viewData.user.contact) {
                viewData.user.contact = {};
            }
            viewData.paypal = {
                email: profile.paypal_email,
                firstname: profile.paypal_firstname,
                lastname: profile.paypal_lastname,
                verified: profile.paypal_verified,
                currency: profile.paypal_currency,
                supported_currencies: currencies,
                currencies: profile.paypal_currencies,
                country: profile.country ? profile.country : getCountry(req)
            };
            reply.view('profile/participate-contest', viewData);
        })
            .fail(function (err) {
                logErrorDetails(err);
            });
    },
    /**
     @function
     @name Controllers:Accountjs.participatePost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
    **/
    participatePost: function (req, reply) {
        if (!req.isVerified) {
            reply().redirect('/account');
        }
        var token = req.session.get('token');

        req.payload.song.tags = req.payload.song.tags.split(',');

        if (req.payload.song.genres && !req.payload.song.genres.push) {
            req.payload.song.genres = [req.payload.song.genres];
        }
        if (req.payload.profile.genres_music && !req.payload.profile.genres_music.push) {
            req.payload.profile.genres_music = [req.payload.profile.genres_music];
        }
        if (req.payload.profile.genres_own && !req.payload.profile.genres_own.push) {
            req.payload.profile.genres_own = [req.payload.profile.genres_own];
        }
        if (req.payload.contact) {
            req.payload.profile.contact = req.payload.contact;
        }
        if (req.payload.song.order === '') {
            delete req.payload.song.order;
        }
        Q.allSettled([
            handleUpload(req.payload.profile.file, req.resources.profile.slug),
            handleUploadSong(req.payload.song.file)
        ])
            .then(function (data) {
                // items should only be saved when EVERYTHING validates correctly,
                // so we need to call the validate routes first
                var endpoints = [
                    api.put('/artists/validate', req.payload.profile, token),
                    api.post('/profile/songs/validate', req.payload.song, token)
                ];

                if (req.payload.video && req.payload.video.youtubeUrl) {
                    endpoints.push(api[req.payload.addVideo.method]('/profile/videos/validate', req.payload.video, token));
                }
                var fileError = {};
                if (data && data[0].value && data[0].value.statusCode) {
                    fileError.picture = data[0];
                } else if (data && data[0].value && !data[0].value.statusCode) {
                    data[0].value = JSON.parse(data[0].value);
                }

                if (data && data[1].value && data[1].value.statusCode) {
                    fileError.audio = data[1].value;
                } else if (data && data[1].value && !data[1].value.statusCode) {
                    data[1].value = JSON.parse(data[1].value);
                }

                if (data && data[0] && data[0].value && data[0].value.filename) {
                    req.payload.profile.picture = data[0].value.filename;
                }
                if (data && data[1] && data[1].value && data[1].value.filename) {
                    req.payload.song.audiofile = data[1].value.filename;
                }
                Q.allSettled(endpoints)
                    .then(function (data2) {
                        var err = {},
                            keys = ['profile', 'song', 'video'],
                            rejected = false;

                        data2.some(function (d, i) {
                            if (d.reason && !d.reason.data) {
                                d.reason.data = [{
                                    message: 'youtubeUrl is already active',
                                    path: 'youtubeUrl',
                                    type: 'string.duplicated'
                                }];
                            }

                            if (d.state == 'rejected' && d.reason.data) {
                                rejected = true;
                                err[keys[i]] = convertErrors(d.reason);
                            }
                        });

                        err = _.merge(err, fileError);
                        if (rejected) {
                            logErrorDetails(err);
                            //err.debug = JSON.stringify(err);
                            req.session.flash('error', err);
                            req.session.flash('payload', req.payload);
                            reply().redirect('/account/participate-contest');
                        } else {
                            var endpoints = [
                                api.put('/profile', req.payload.profile, token),
                                api.post('/profile/songs', req.payload.song, token)
                            ];

                            /*if (req.payload.video.youtubeUrl != '')
                        endpoints.push(api[req.payload.addVideo.method](req.payload.addVideo.id ? '/profile/videos/' + req.payload.addVideo.id : '/profile/videos', req.payload.video, token));*/

                            Q.allSettled(endpoints)
                                .then(function (data) {
                                    req.isComplete = data[0].value.isComplete;
                                    if (req.isComplete && !req.session.get('isComplete') || data[0].value.isComplete) {
                                        req.session.set('isComplete', true);
                                    }
                                    req.isVerified = data[0].value.verified;
                                    if (req.isVerified && !req.session.get('isVerified') || data[0].value.verified) {
                                        req.session.set('isVerified', true);
                                    }
                                    var profile = req.resources && req.resources.profile ? req.resources.profile : false;
                                    profile.picture = data[0].value.picture;
                                    req.session.set('profile', profile);

                                    api.put('/profile/songs/' + data[1].value._id + '/nominate', {}, token)
                                        .then(function (data) {
                                            console.log('nominated');
                                        })
                                        .fail(function (err) {
                                            logErrorDetails(err);
                                        });

                                    api.get('/profile/songs', req.session.get('token')).then(function (response) {
                                        var songs = response.songs;
                                        var pending = songs.filter(function (s) {
                                            return s.state == 'pending';
                                        });
                                        req.session.flash('first-participation', songs.length == 1 && pending.length == 1);
                                        reply().redirect('/account/songs');
                                    }).fail(function (err) {
                                        logErrorDetails(err);
                                        reply(err);
                                    });
                                    //reply().redirect('/account');
                                })
                                .fail(function (err) {
                                    logErrorDetails(err);
                                    reply(err);
                                })
                                .fail(function (error) {
                                    logErrorDetails(error);
                                });
                        }
                    });
            })
            .fail(function (err) {
                logErrorDetails(err);
                reply(err);
            });
    },
    /**
     @function
     @name Controllers:Accountjs.createPromoteSongView
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @param {object} server - Server object
     * @description Checks  isVerified, Token, type(FAN or ARTIST) from session
     * then renders profile/add-song view
    **/
    createPromoteSongView: function (req, reply, server) {
        if (!req.isVerified) {
            reply().redirect('/account');
        }
        var token = req.session.get('token'),
            payload = req.session.flash('payload')[0] || {};

        if (!token) {
            reply().redirect('/');
        }
        if (req.session.get('type') == 'fan') {
            reply().redirect('/account');
        }
        //if (payload && payload.contact)
        //payload.profile.contact = payload.contact;

        Q.allSettled([
            api.get('/profile', token),
            api.get('/config/genres'),
            api.get('/config/countries')
        ]).then(function (data) {
            var data1 = {
                metatags: {
                    title: server.i18n.__('meta-title-add-song')
                },
                user: payload.profile || data[0].value,
                genres: data[1].value,
                countries: data[2].value,
                song: payload.song || {},
                error: req.session.flash('error')[0] || false
            };

            if (!data1.user.contact) {
                data1.user.contact = {};
            }
            reply.view('profile/add-song', data1);
        })
            .fail(function (err) {
                logErrorDetails(err);
            });
    },
    /**
     @function
     @name Controllers:Accountjs.createPromoteSongPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @param {object} server - Server object
     * @description Checks  isVerified, Token, type(FAN or ARTIST) from session
     * then renders profile/add-song-success view
    **/
    createPromoteSongPost: function (req, reply) {
        if (!req.isVerified) {
            reply().redirect('/account');
        }
        var token = req.session.get('token');

        req.payload.song.tags = req.payload.song.tags.split(',');

        if (req.payload.song.genres && !req.payload.song.genres.push) {
            req.payload.song.genres = [req.payload.song.genres];
        }
        if (req.payload.profile.genres_music && !req.payload.profile.genres_music.push) {
            req.payload.profile.genres_music = [req.payload.profile.genres_music];
        }
        if (req.payload.profile.genres_own && !req.payload.profile.genres_own.push) {
            req.payload.profile.genres_own = [req.payload.profile.genres_own];
        }
        if (req.payload.contact) {
            req.payload.profile.contact = req.payload.contact;
        }
        if (req.payload.song.order === '') {
            delete req.payload.song.order;
        }
        Q.allSettled([
            handleUpload(req.payload.profile.file, req.resources.profile.slug),
            handleUploadSong(req.payload.song.file)
        ])
            .then(function (data) {
                // items should only be saved when EVERYTHING validates correctly,
                // so we need to call the validate routes first

                var fileError = {};
                if (data && data[0] !== undefined && data[0].value && data[0].value.statusCode) {
                    fileError.picture = data[0];
                } else if (data && data[0] && data[0].value && !data[0].value.statusCode) {
                    data[0].value = JSON.parse(data[0].value);
                }

                if (data && data[1] !== undefined && data[1].value && data[1].value.statusCode) {
                    fileError.audio = data[1].value;
                } else if (data && data[1] && data[1].value && !data[1].value.statusCode) {
                    data[1].value = JSON.parse(data[1].value);
                }

                if (data && data[0] && data[0].value && data[0].value.filename) {
                    req.payload.profile.picture = data[0].value.filename;
                }
                if (data && data[1] && data[1].value && data[1].value.filename) {
                    req.payload.song.audiofile = data[1].value.filename;
                }
                req.payload.profile.skip_paypal = true;
                Q.allSettled([
                    api.put('/artists/validate', req.payload.profile, token),
                    api.post('/profile/songs/validate', req.payload.song, token)
                ])
                    .then(function (data2) {
                        var err = {},
                            keys = ['profile', 'song'],
                            rejected = false;

                        data2.some(function (d, i) {
                            if (d.state == 'rejected' && d.reason.data) {
                                rejected = true;
                                err[keys[i]] = convertErrors(d.reason);
                            }
                        });

                        err = _.merge(err, fileError);
                        if (rejected) {
                            logErrorDetails(err);

                            if (config.debug) {
                                err.debug = JSON.stringify(err);
                            }
                            req.session.flash('error', err);
                            req.session.flash('payload', req.payload);
                            reply().redirect('/account/add-song');
                        } else {
                            Q.all([
                                api.put('/profile', req.payload.profile, token),
                                api.post('/profile/songs', req.payload.song, token)
                            ])
                                .then(function (data) {
                                    req.isComplete = data[0].isComplete;
                                    if (req.isComplete && !req.session.get('isComplete') || data[0].isComplete) {
                                        req.session.set('isComplete', true);
                                    }
                                    req.isVerified = data[0].verified;
                                    if (req.isVerified && !req.session.get('isVerified') || data[0].verified) {
                                        req.session.set('isVerified', true);
                                    }
                                    var profile = req.resources.profile;
                                    profile.picture = data[0].picture;
                                    req.resources.profile = profile;

                                    reply.view('profile/add-song-success');
                                    //reply().redirect('/account');
                                })
                                .fail(function (err) {
                                    logErrorDetails(err);
                                    reply(err);
                                })
                                .fail(function (error) {
                                    logErrorDetails(error);
                                });
                        }
                    });
            })
            .fail(function (err) {
                logErrorDetails(err);
                reply(err);
            });
    },
    /**
     @function
     @name Controllers:Accountjs.mySettingGet
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description Checks  Token, type(FAN or ARTIST) from session
     * then renders pages/account/system-setting view
    **/
    mySettingGet: function (req, reply) {
        var data;
        var token = req.session.get('token');
        if (!token) {
            reply().redirect('/');
        }

        Q.all([
            api.get('/profile', token),
            api.get('/config/countries')
        ]).then(function (_data) {
            data = _data;
            var country = [];
            _.each(data[1], function (object) {
                var obc = {};
                obc['value'] = object.code;
                obc['text']  = object.name;
                if (data[0].preferredCountry && object.code == data[0].preferredCountry) {
                    obc['selected'] = 'true';
                }
                country.push(obc);
            });
            console.log(data[0]);
            reply.view('pages/account/system-setting', {
                    user: data[0],
                    countries: country,
                    message: req.session.flash('message')
                });
        }).fail(function (err) {
            logErrorDetails(err);
        });
    },
    /**
    @function
    @name Controllers:Accountjs.mysettingPost
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description checks whether the user is logged in
     * redirect to account/profile/settings
    **/
    mySettingPost: function (req, reply) {
        var token = req.session.get('token');
        if (!token) {
            reply().redirect('/');
        }
        if (req.payload.newsletter) {
            req.payload.newsletter = 'on';
        }
        if (req.payload.notifications) {
            req.payload.notifications = 'on';
        }
        if (req.payload.newsletter) {
            req.payload.activitystream = 'on';
        }
        if (req.payload.arenaVideo) {
            req.payload.arena = 'video';
            delete req.payload.arenaVideo;
        }else if (req.payload.arenaAudio) {
            req.payload.arena = 'audio';
            delete req.payload.arenaAudio;
        }
        api.put('/profile/settings', req.payload, token)
        .then(function (data) {
            req.session.flash('message', 'Your profile have Updated succesfully');
            reply().redirect('/account/profile/settings');
        })
        .fail(function (err) {
            logErrorDetails(err);
            reply().redirect('/account/profile/settings');
        });
    },
    /**
   @function
   @name Controllers:Accountjs.artistDashboard
    * @param {object} req - Request object
    * @param {interface} reply - hapi reply interface
    * @description checks whether the user is logged in
    * redirect to pages/dashboard/dashboard-artist
   **/
    dashboardPurchaseItem: function (req, reply) {
        var page = req.query.page ? req.query.page : 1;
        var endpoint = '/payment/order/' + req.session.get("profileID") + '/buyer?limit=10&';
        if (req.query.page) {
            endpoint += 'skip=' + ((req.query.page - 1) * 10);
        }
        if (req.session.get('token')) {
            Q.all([
                api.get('/payments/address/' + req.session.get("profileID") + '/bill'),
                api.get('/payments/address/' + req.session.get("profileID") + '/ship'),
                api.get('/payments-method/' + req.session.get("profileID")),
                api.get('/artists/' + req.session.get("profileID") + '/product-purchase'),
                api.get(endpoint)
            ]).spread(function (bill, ship, accountDetail, contestProductPurchased, purchaseItem) {
                var artistInfo = req.resources.profile;
                var billingAddress = [];
                var shipingAddress = [];
                var preferredAccount = [];
                var defaultBillAddress;
                var defaultShipAddress;

                _.each(accountDetail, function (object) {
                    if (object.set_preferred) {
                        var obc = {};
                        if (object.type === 'creditcard') {
                            obc.type = object.type;
                            obc.text = object.card_no;
                        }
                        if (object.type === 'paypal') {
                            obc.type = object.type;
                            obc.text = object.paypal_username;
                        }
                        obc.value = "";
                        preferredAccount.push(obc);
                    }
                });
                _.each(bill, function (object) {
                    if (bill.prefer_bill) {
                        var obc = {};
                        obc.value = "";
                        obc.text = object.firstname + " " + object.lastname + " " + object.address + " " + object.city + " " + object.postal_code + " " + object.country;
                        billingAddress.push(obc);
                        defaultBillAddress = object;
                    }
                });
                _.each(ship, function (object) {
                    if (ship.prefer_ship) {
                        var obc = {};
                        obc.value = "";
                        obc.text = object.firstname + " " + object.lastname + " " + object.address + " " + object.city + " " + object.postal_code + " " + object.country;
                        shipingAddress.push(obc);
                        defaultShipAddress = object;
                    }
                });
                if (!billingAddress.length) {
                    var obc = {};
                    obc.value = "";
                    obc.text = "You have no default billing address";
                    billingAddress.push(obc);
                }
                if (!shipingAddress.length) {
                    var obj = {};
                    obj.value = "";
                    obj.text = "You have no default shipping address";
                    shipingAddress.push(obj);
                }
                if (!preferredAccount.length) {
                    var ob = {};
                    ob.value = "";
                    ob.text = "No account information Found";
                    preferredAccount.push(ob);
                }
                reply.view('pages/dashboard/purchase-item', {
                    billingAddress: billingAddress,
                    shipingAddress: shipingAddress,
                    defaultBillAddress: defaultBillAddress,
                    defaultShipAddress: defaultShipAddress,
                    artistInfo: artistInfo,
                    preferredAccount: preferredAccount,
                    purchaseItem: purchaseItem.orders,
                    activepage: page,
                    numPages: Math.ceil(purchaseItem.total_count / 10),
                    url: '/account/artist-dashboard?',
                    contestProductPurchased: contestProductPurchased
                });
            }).fail(function (error) {
                console.log(error);
                console.log("error");
            });
        }else {
            reply().redirect('/account/login');
        }
    },
    /**
  @function
  @name Controllers:Accountjs.artistDashboard
   * @param {object} req - Request object
   * @param {interface} reply - hapi reply interface
   * @description checks whether the user is logged in
   * redirect to pages/dashboard/dashboard-artist
  **/
    dashboardSoldItem: function (req, reply) {
        var page = req.query.page ? req.query.page : 1;
        var endpoint = '/payment/order/' + req.session.get("profileID") + '/seller?limit=10&';
        if (req.query.page) {
            endpoint += 'skip=' + ((req.query.page - 1) * 10);
        }
        if (req.session.get('token')) {
            Q.all([
                api.get('/payments/address/' + req.session.get("profileID") + '/bill'),
                api.get('/payments/address/' + req.session.get("profileID") + '/ship'),
                api.get('/payments-method/' + req.session.get("profileID")),
                api.get('/artists/' + req.session.get("profileID") + '/product-sell'),
                api.get(endpoint)
            ]).spread(function (bill, ship, accountDetail, contestProductCell, soldItem) {
                var artistInfo = req.resources.profile;
                var billingAddress = [];
                var shipingAddress = [];
                var preferredAccount = [];
                var defaultBillAddress;
                var defaultShipAddress;

                _.each(accountDetail, function (object) {
                    if (object.set_preferred) {
                        var obc = {};
                        if (object.type === 'creditcard') {
                            obc.type = object.type;
                            obc.text = object.card_no;
                        }
                        if (object.type === 'paypal') {
                            obc.type = object.type;
                            obc.text = object.paypal_username;
                        }
                        obc.value = "";
                        preferredAccount.push(obc);
                    }
                });
                _.each(bill, function (object) {
                    if (bill.prefer_bill) {
                        var obc = {};
                        obc.value = "";
                        obc.text = object.firstname + " " + object.lastname + " " + object.address + " " + object.city + " " + object.postal_code + " " + object.country;
                        billingAddress.push(obc);
                        defaultBillAddress = object;
                    }
                });
                _.each(ship, function (object) {
                    if (ship.prefer_ship) {
                        var obc = {};
                        obc.value = "";
                        obc.text = object.firstname + " " + object.lastname + " " + object.address + " " + object.city + " " + object.postal_code + " " + object.country;
                        shipingAddress.push(obc);
                        defaultShipAddress = object;
                    }
                });
                if (!billingAddress.length) {
                    var obc = {};
                    obc.value = "";
                    obc.text = "You have no default billing address";
                    billingAddress.push(obc);
                }
                if (!shipingAddress.length) {
                    var obj = {};
                    obj.value = "";
                    obj.text = "You have no default shipping address";
                    shipingAddress.push(obj);
                }
                if (!preferredAccount.length) {
                    var ob = {};
                    ob.value = "";
                    ob.text = "No account information Found";
                    preferredAccount.push(ob);
                }
                reply.view('pages/dashboard/sold-item', {
                    billingAddress: billingAddress,
                    shipingAddress: shipingAddress,
                    defaultBillAddress: defaultBillAddress,
                    defaultShipAddress: defaultShipAddress,
                    artistInfo: artistInfo,
                    preferredAccount: preferredAccount,
                    soldItem: soldItem.orders,
                    activepage: page,
                    numPages: Math.ceil(soldItem.total_count / 10),
                    url: '/account/artist-dashboard?',
                    contestProductCell: contestProductCell
                });
            }).fail(function (error) {
                console.log(error);
                console.log("error");
            });
        }else {
            reply().redirect('/account/login');
        }
    },
    /**
    @function
    @name Controllers:Accountjs.fanDashboard
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description checks whether the user is logged in
     * redirect to pages/dashboard/dashboard-fan
    **/
    fanDashboard: function (req, reply) {
        var page = req.query.page ? req.query.page : 1;
        var skip = 0;
        var endpoint = '/payment/order/' + req.session.get("profileID") + '/buyer?limit=10&';
        if (req.query.page) {
            endpoint += 'skip=' + ((req.query.page - 1) * 10);
        }
        if (req.session.get('token')) {
            Q.all([
                api.get('/payments/address/' + req.session.get("profileID") + '/bill'),
                api.get('/payments/address/' + req.session.get("profileID") + '/ship'),
                api.get('/payments-method/' + req.session.get("profileID")),
                api.get('/fans/' + req.session.get("profileID") + '/product-purchase'),
                api.get(endpoint),
            ]).spread(function (bill, ship, accountDetail, contestProductPurchased, purchaseItem) {
                
                var fanInfo = req.resources.profile;
                var billingAddress = [];
                var shipingAddress = [];
                var preferredAccount = [];
                var defaultBillAddress;
                var defaultShipAddress;
                _.each(accountDetail, function (object) {
                    if (object.set_preferred) {
                        var obc = {};
                        if (object.type === 'creditcard') {
                            obc.type = object.type;
                            obc.text = object.card_no;
                        }
                        if (object.type === 'paypal') {
                            obc.type = object.type;
                            obc.text = object.paypal_username;
                        }
                        obc.value = "";
                        preferredAccount.push(obc);
                    }
                });
                _.each(bill, function (object) {
                    if (bill.prefer_bill) {
                        var obc = {};
                        obc.value = "";
                        obc.text = object.firstname + " " + object.lastname + " " + object.address + " " + object.city + " " + object.postal_code + " " + object.country;
                        billingAddress.push(obc);
                        defaultBillAddress = object;
                    }
                });
                _.each(ship, function (object) {
                    if (bill.prefer_bill) {
                        var obc = {};
                        obc.value = "";
                        obc.text = object.firstname + " " + object.lastname + " " + object.address + " " + object.city + " " + object.postal_code + " " + object.country;
                        shipingAddress.push(obc);
                        defaultShipAddress = object;
                    }
                });
                if (!billingAddress.length) {
                    var obc = {};
                    obc.value = "";
                    obc.text = "You have no default billing address";
                    billingAddress.push(obc);
                }
                if (!shipingAddress.length) {
                    var obj = {};
                    obj.value = "";
                    obj.text = "You have no default shipping address";
                    shipingAddress.push(obj);
                }
                if (!preferredAccount.length) {
                    var ob = {};
                    ob.value = "";
                    ob.text = "No account information Found";
                    preferredAccount.push(ob);
                }
                reply.view('pages/dashboard/dashboard-fan', {
                    billingAddress: billingAddress,
                    shipingAddress: shipingAddress,
                    defaultBillAddress: defaultBillAddress,
                    defaultShipAddress: defaultShipAddress,
                    fanInfo: fanInfo,
                    preferredAccount: preferredAccount,
                    purchaseItem: purchaseItem.orders,
                    activepage: page,
                    numPages: Math.ceil(purchaseItem.total_count / 10),
                    url: '/account/fan-dashboard?',
                    contestProductPurchased: contestProductPurchased
                });
            }).fail(function (error) {
                console.log(error);
                console.log("error");
            });
        }else {
            reply().redirect('/account/login');
        }
    },
    /**
    @function
    @name Controllers:Accountjs.getProductStatus
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description Updates the status of the order
    **/
    getProductStatus: function (req, reply) {
        var orderNumber = req.query.orderNumber;
        var payload = {};
        payload.shipping_status = req.query['status'];
        payload.seller = req.session.get("profileID");

        api.put('/payments/order/ship/' + orderNumber, payload, req.session.get('token'))
        .then(function (data) {
            reply("ok");
        }).fail(function (error) {
            reply("error");
        });
    },
    /**
    @function
    @name Controllers:Accountjs.getSystemSetting
     * @param {object} req - Request object
     * @param {interface} reply - hapi reply interface
     * @description Renders Sysyten Setting Page
    **/
    getSystemSetting: function (req, reply) {
        api.get('/config/countries')
        .then(function (countries) {
            var country = [];
            _.each(countries, function (object) {
                var obc = {};
                obc['value'] = object.code;
                obc['text']  = object.name;
                country.push(obc);
            });
            reply.view('pages/account/system-setting.jade', {
                countries: country
            });
        })
        .fail(function (err) {
            console.log(err);
        });
    }
};
