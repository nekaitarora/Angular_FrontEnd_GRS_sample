var Hapi = require('hapi'),
    config = require('./config'),
    Path = require('path'),
    api = require('./lib/api'),
    helpers = require('./helpers'),
    _ = require('lodash'),
    r = require('ua-parser'),
    getCurrency = require('./helpers/getCurrency'),
    getCountry = require('./helpers/getCountry'),
    cachedResource = require('./lib/cached-ressoure'),
    fs = require('fs');

/*Creating a New Server object*/
var server = new Hapi.Server(config.hapiOptions, { cors: true });
/*Adds an incoming server connection*/
server.connection({ port: config.port});
/*Registering the plugins*/
server.register(config.plugins, function (err) {
    if (err) {
        throw err;
    }
    // Declare an authentication strategy using the bell scheme
    // with the name of the provider, cookie encryption password,
    // and the OAuth client credentials.
    server.auth.strategy('facebook', 'bell', {
        provider: 'facebook', // Name of the third-party provider
        password: 'cookie_encryption_password', // Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
        clientId: config.facebook.standard.clientID, // Client ID of our APP
        clientSecret: config.facebook.standard.clientSecret, // Client Secret of our APP
        isSecure: false,     // Terrible idea but required if not using HTTPS
        scope: ['user_friends'] // This option is for accessing friend's list of the user from FB
    });
});

/*Configure JADE as templating engine on the server.*/
server.views(config.views);
/** get last modified timestamp of files */
var staticResources = ['/scripts', '/styles', '/images'];
config.lastModifiedTimestamps = require('./lib/checkLastModifiedTimestamps')(staticResources);

var i18n = require('./lib/i18n');
server.i18n = i18n;

// This Folder is required for temporary store images while uploading profile images of user
if (!fs.existsSync(Path.join("./temp"))) {
    fs.mkdirSync(Path.join("./temp"));
}

/**
*   @event
*   @name Appjs:/robots.txt
*   @description This event is used to prevent the bots of search engine
*   and other malware to search  or access the content of the website
**/
server.route({
    method: 'GET',
    path: '/robots.txt',
    handler: function (req, reply) {
        if (config.robots) {
            reply.file(config.robots);
        }
    }
});
require('./routes')(server);

server.ext('onPreHandler', require('./lib/getIpInformation'));
server.ext('onPreHandler', require('./request-handlers/pre/get-cached-global-resources'));
server.ext('onPreHandler', require('./lib/setVerifiedVars'));

server.ext('onPreResponse', function (request, reply) {
    if (request.resources == undefined) {
        return reply.continue();
    }
    if (request.route.path != '/{path*}' && request.route.path.substring(0, 3) == '/v1') {
        request.resources['rendering'] = 'version1';
    }

    var response = request.response;
    if (!response.isBoom && response.statusCode < 400) {
        return reply.continue();
    }

    var errorCode = response.statusCode || 500;

    if (request.headers['x-requested-with']) return reply.continue();
    var ip = request.resources.ip;
    var context = _.merge({
        ip: ip,
        user: request.session.get('token'),
        location: request.session.get('location') || getCountry(request.resources.profile, ip),
        activeTree: {},
        isErrorPage: true,
        settings: request.resources.settings
    }, helpers);

    api.get('/contents/error-' + errorCode).then(function (data) {
        context.metatags = { title: data.title };
        context.content = data;
        reply.view('v1/page', context);
    }).fail(function () {
        api.get('/contents/error-500').then(function (data) {
            context.metatags = { title: data.title };
            context.content = data;
            reply.view('v1/page', context);
        }).fail(function () {
            require('./request-handlers/pre/get-cached-global-resources')(request, response);
            reply.view('pages/error/500', context);
        });
    });

});

server.ext('onPreResponse', function (req, reply) {
    if (req.resources == undefined) {
        return reply.continue();
    }
    var ip = req.resources.ip;

    _.merge(this, helpers, req.resources);

    var url = req.route.path.split('/');

    this.activeTree = {
        first: url[1] || 'home',
        second: url.length > 2 ? url[2] : '',
        third: url.length > 3 ? url[3] : ''
    };

    var metatags = {
        image: config.staticFiles + '/images/stream.png',
        title: this.__('title-default'),
        description: this.__('description-default'),
    };

    if (this.metatags && this.metatags.title) {
        this.title += ' | ' + metatags.title;
    }

    this.metatags = _.merge(metatags, this.metatags);

    var currencyCode = false;
    if (req.resources && req.resources.profile) {
        var profile = req.resources.profile;
        profile.type = req.session.get('type');

        this.profile = profile;

        currencyCode = req.resources.profile.currency;

        if (req.isComplete) {
            this.isComplete = req.isComplete;
        }

        if (req.isVerified) {
            this.isVerified = req.isVerified;
        }
    }

    var ip = req.resources.ip;
    this.ip = ip;

    // location
    this.location       = req.session.get('location') || getCountry(req.resources.profile, ip);
    this.profilePicture = (req.session.get('picture') ? req.session.get('picture') : '');
    this.profileSlug    = (req.session.get('type') ? (req.session.get('type') === 'artist' ? ('/artists/' + req.session.get('slug')) : ('/fans/' + req.session.get('slug'))) : '');
    this.isLoggedIn     = req.session.get('type') ? true : false;
    this.profileType    = req.session.get('type');

    // currency
    if (!currencyCode) {
        currencyCode = getCurrency(ip);
    }

    this.currentCurrency = 'USD'; // currencyCode;

    // global resources
    this.mediaPartner = req.resources.mediaPartner;
    this.settings = req.resources.settings;
    this.backgrounds = req.resources.backgrounds;

    var ua = r.parse(req.headers['user-agent']);
    this.ua = ua;

    this.frontendUrl = config.frontendUrl;


    return reply.continue();
});

server.ext('onPreResponse', function (request, reply) {
    if (request.resources && request.resources.settings) {
        if (request.resources.settings.maintenanceNote) {
            var getAsset = require('./helpers/getAsset');
            reply.view('pages/maintenance/index', {
                getAsset: getAsset
            });
        }else {
            return reply.continue();
        }
    }else {
        return reply.continue();
    }
});

module.exports = server;
