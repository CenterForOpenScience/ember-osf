import Ember from 'ember';
import md5 from 'npm:js-md5';
import _get from 'npm:lodash/get';
import Cookie from 'npm:js-cookie';
import config from 'ember-get-config';
import keenTracking from 'npm:keen-tracking';
import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default BaseAdapter.extend({
    session: Ember.inject.service(),

    toStringExtension() {
        return 'Keen';
    },

    init() {},

    trackEvent(properties, node) {
        window.contextVars = {};
        window.contextVars.currentUser = this.userContextVars();
        window.contextVars.node = this.nodeContextVars(node);
        return this.KeenTracker().getInstance().trackPrivateEvent('front-end-events', { interaction: properties }, node);
    },

    trackPage(properties) {
        window.contextVars = {};
        window.contextVars.currentUser = this.userContextVars();
        return this.KeenTracker().getInstance().trackPageView({ pageViewed: properties });
    },

    trackSpecificCollection(collection, properties, node) {
        window.contextVars = {};
        window.contextVars.currentUser = this.userContextVars();
        window.contextVars.node = this.nodeContextVars(node);
        return this.KeenTracker().getInstance().trackPrivateEvent(collection, { interaction: properties }, node);
    },

    willDestroy() {},

    KeenTracker() {
        function _nowUTC() {
            var now = new Date();
            return new Date(
                now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()
            );
        }

        function _createOrUpdateKeenSession() {
            var expDate = new Date();
            var expiresInMinutes = 25;
            expDate.setTime(expDate.getTime() + (expiresInMinutes * 60 * 1000));
            var currentSessionId = Cookie.get('keenSessionId') || keenTracking.helpers.getUniqueId();
            Cookie.set('keenSessionId', currentSessionId, {
                expires: expDate, path: '/'
            });
        }

        function _getOrCreateKeenId() {
            if (!Cookie.get('keenUserId')) {
                Cookie.set('keenUserId', keenTracking.helpers.getUniqueId(), {
                    expires: 365, path: '/'
                });
            }
            return Cookie.get('keenUserId');
        }

        function _defaultKeenPayload() {
            _createOrUpdateKeenSession();

            var user = window.contextVars.currentUser;
            var node = window.contextVars.node;
            var pageMeta = _get(window, 'contextVars.analyticsMeta.pageMeta', {}); // Do not have this information.
            return {
                page: {
                    title: document.title,
                    url: document.URL,
                    meta: pageMeta,
                    info: {},
                },
                referrer: {
                    url: document.referrer,
                    info: {},
                },
                time: {
                    local: keenTracking.helpers.getDatetimeIndex(),
                    utc: keenTracking.helpers.getDatetimeIndex(_nowUTC()),
                },
                node: {
                    id: _get(node, 'id'),
                    title: _get(node, 'title'),
                    type: _get(node, 'category'),
                    tags: _get(node, 'tags'),
                },
                anon: {
                    id: md5(Cookie.get('keenSessionId')),
                    continent: user.anon.continent,
                    country: user.anon.country,
                },
                meta: {
                    epoch: 1, // version of pageview event schema
                },
                keen: {
                    addons: [
                        {
                            name: 'keen:url_parser',
                            input: {
                                url: 'page.url',
                            },
                            output: 'page.info',
                        },
                        {
                            name: 'keen:url_parser',
                            input: {
                                url: 'referrer.url',
                            },
                            output: 'referrer.info',
                        },
                        {
                            name: 'keen:referrer_parser',
                            input: {
                                referrer_url: 'referrer.url',
                                page_url: 'page.url',
                            },
                            output: 'referrer.info',
                        },
                    ]
                },
            };
        }  // end _defaultKeenPayload

        function _trackCustomEvent(client, collection, eventData) {
            if (client === null) {
                return;
            }
            client.recordEvent(collection, eventData);
        }

        function _trackCustomEvents(client, events) {
            if (client === null) {
                return;
            }
            client.recordEvents(events);
        }

        function KeenTracker() {
            if (instance) {
                throw new Error('Cannot instantiate another KeenTracker instance.');
            } else {
                var _this = this;

                _this._publicClient = null;
                _this._privateClient = null;

                _this.init = function _initKeentracker(params) {
                    var _this = this;

                    if (params === undefined) {
                        return _this;
                    }

                    _this._publicClient = keenTracking({
                        projectId: params.public.projectId,
                        writeKey: params.public.writeKey,
                    });
                    _this._publicClient.extendEvents(_defaultPublicKeenPayload);

                    _this._privateClient = keenTracking({
                        projectId: params.private.projectId,
                        writeKey: params.private.writeKey,
                    });
                    _this._privateClient.extendEvents(_defaultPrivateKeenPayload);

                    return _this;
                };

                var _defaultPublicKeenPayload = function() { return _defaultKeenPayload(); };
                var _defaultPrivateKeenPayload = function() {
                    var payload = _defaultKeenPayload();
                    var user = window.contextVars.currentUser;
                    payload.visitor = {
                        id: _getOrCreateKeenId(),
                        session: Cookie.get('keenSessionId'),
                        returning: Boolean(Cookie.get('keenUserId')),
                    };
                    payload.tech = {
                        browser: keenTracking.helpers.getBrowserProfile(),
                        ua: '${keen.user_agent}',
                        ip: '${keen.ip}',
                        info: {},
                    };
                    payload.user = {
                        id: user.id,
                        entry_point: user.entryPoint,
                        institutions: user.institutions,
                        locale: user.locale,
                        timezone: user.timezone,
                    };
                    payload.keen.addons.push({
                        name: 'keen:ip_to_geo',
                        input: {
                            ip: 'tech.ip',
                        },
                        output: 'geo',
                    });
                    payload.keen.addons.push({
                        name: 'keen:ua_parser',
                        input: {
                            ua_string: 'tech.ua'
                        },
                        output: 'tech.info',
                    });

                    return payload;
                };

                _this.trackPageView = function (data) {
                    var _this = this;
                    if (_get(window, 'contextVars.node.isPublic', false) &&
                        _get(window, 'contextVars.analyticsMeta.pageMeta.public', false)) {
                        _this.trackPublicEvent('pageviews', data);
                    }
                    _this.trackPrivateEvent('pageviews', data);
                };

                _this.trackPrivateEvent = function(collection, event) {
                    return _trackCustomEvent(_this._privateClient, collection, event);
                };
                _this.trackPrivateEvents = function(events) {
                    return _trackCustomEvents(_this._privateClient, events);
                };

                _this.trackPublicEvent = function(collection, event) {
                    return _trackCustomEvent(_this._publicClient, collection, event);
                };
                _this.trackPublicEvents = function(events) {
                    return _trackCustomEvents(_this._publicClient, events);
                };
            }
        }

        var instance = null;
        return {
            getInstance() {
                if (!instance) {
                    let configInfo = {};
                    config.metricsAdapters.forEach((adapter) => {
                        if (adapter.name === 'Keen') {
                            configInfo = adapter.config;
                        }
                    });
                    instance = new KeenTracker();
                    instance.init(configInfo);
                }
                return instance;
            }
        };
    },
    userContextVars() {
        // Extract user variables from session.
        const session = this.get('session');
        let user = {};
        if (session.get('isAuthenticated')) {
            let userInfo = session.get('session.authenticated');
            user = {
                id: userInfo.id,
                entry_point: userInfo.attributes.entry_point, // Don't have the entry point.
                institutions: null, // Don't really want to make an API request to fetch user institutions.
                locale: userInfo.attributes.locale,
                timezone: userInfo.attributes.timezone
            };
        }
        user.anon = {}; // Do not have this info, but most duplicated in geo.
        return user;
    },
    nodeContextVars(node) {
        // Extract node variables, if passed in.
        let nodeVars = {};
        if (node && node.id) {
            nodeVars = {
                id: node.get('id'),
                title: node.get('title'),
                type: node.get('category'),
                tags: node.get('tags'),
                isPublic: node.get('public')
            };
        }
        return nodeVars;
    },
});
