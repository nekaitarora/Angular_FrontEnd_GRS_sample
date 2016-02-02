'use strict';

var cachedResource = require('../../lib/cached-ressoure'),
    Q = require('q'),
    api = require('../../lib/api'),
    getCountry = require('../../helpers/getCountry'),
    _ = require('lodash');

module.exports = function getCachedGlobalResources(req, reply) {
    var mediaCountry = req.resources.ip && req.resources.ip.country ? req.resources.ip.country : '';

    var endpoints = [
        cachedResource('/contests/current'),
        cachedResource('/contests/next'),
        cachedResource('/contests/previous'),
        cachedResource('/media-partners?search[country]=' + mediaCountry + '&search[platform]=web&search[public]=true'),
        api.get('/settings'),
        cachedResource('/backgrounds/path/' + encodeURIComponent(req.path)),
        cachedResource('/config/genres'),
        cachedResource('/config/countries'),
        cachedResource('/config/rejections'),
        cachedResource('/config/currencies'),

    ];

    var token = req.session.get('token');
    if (token) {
        endpoints.push(api.get('/profile', token));
        if (req.session.get('type') == 'artist') {
            endpoints.push(api.get('/projects', token));
        }
    }

    Q.allSettled(endpoints).spread(function (currentContest, nextContest, previousContest, partners, settings, backgrounds, genres, countries, rejections, currencies, profile, projects) {
        req.resources = req.resources || {};
        req.resources['rendering'] = 'version2';
        req.resources.currentContest = (currentContest.state === 'fulfilled') ? currentContest.value : {};
        req.resources.nextContest = (nextContest.state === 'fulfilled') ? nextContest.value : {};
        req.resources.previousContest = (previousContest.state === 'fulfilled') ? previousContest.value : {};
        req.resources.mediaPartner = (partners.state === 'fulfilled') ? partners.value.media_partners[0] : {};
        req.resources.settings = (settings.state === 'fulfilled') ? settings.value : {};
        req.resources.backgrounds = (settings.state === 'fulfilled') ? backgrounds.value : {};
        req.resources.genres = (genres.state === 'fulfilled') ? genres.value : {};
        req.resources.countries = (countries.state === 'fulfilled') ? countries.value : {};
        req.resources.rejections = (rejections.state === 'fulfilled') ? rejections.value : [];
        req.resources.currencies = (currencies.state === 'fulfilled') ? currencies.value : [];

        req.resources.profile = (profile && profile.state === 'fulfilled') ? profile.value : false;
        /*Code to check whether user is ADMIN OR NOT */
        if (req.resources.profile) {
            req.resources.profile['isAdmin'] = false;
            api.get('/profile/is-frontend-admin', token).then(function (rsl) {
                if (rsl != undefined) {
                    req.resources.profile['isAdmin'] = true;
                }
            })
            .fail(function (err) {
                console.log(err);
            });
        }
        req.resources.hasActiveProject = false;
        if (projects && projects.state === 'fulfilled') {
            var activeProject = _.find(projects.value, function (proj) {
                return (proj.state === 'published' ||  proj.state === 'publish-pending') &&
                    new Date(proj.releaseDate) > new Date();
            });

            if (activeProject) {
                req.resources.hasActiveProject = true;
            }
        }

        return reply.continue();
    }).fail(function (err) {
        console.error(err);
        return reply.continue();
    });
};
