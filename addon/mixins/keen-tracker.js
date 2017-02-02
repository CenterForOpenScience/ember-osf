import Ember from 'ember';
import md5 from 'npm:js-md5';
import _get from 'npm:lodash/get';
import Cookie from 'npm:js-cookie';
import config from 'ember-get-config';
import keenTracking from 'npm:keen-tracking';

// Adapted from website/static/js/keen.js
export default Ember.Mixin.create({
    session: Ember.inject.service(),

    // Add this mixin to your route, and the afterModel hook will send pageviews to keen
    afterModel(model) { // Using afterModel hook so node info can be sent to keen
        window.contextVars = {};
        window.contextVars.currentUser = this.userContextVars();
        window.contextVars.node = this.nodeContextVars(model); // model may not be a node, in which case, only id might be extracted
        return this.KeenTracker().getInstance().trackPageView();
    },
    actions: {
        //keenClick action can be used in template
        keenClick(category, label, node) {
            return this.keenTrackFrontEndEvent({ category: category, action: 'click', label: label }, node);

        },
        //keenTrack action can be used in template
        keenTrack(category, action, label, node) {
            return this.keenTrackFrontEndEvent({ category: category, action: action, label: label }, node);
        }
    },
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
                    instance = new KeenTracker();
                    instance.init(config.KEEN);
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
        if (node) {
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
    keenTrackEvent(collection, properties, node) {
        // Adds context vars and sends keen trackPrivateEvent method
        window.contextVars = {};
        window.contextVars.currentUser = this.userContextVars();
        window.contextVars.node = this.nodeContextVars(node);
        return this.KeenTracker().getInstance().trackPrivateEvent(collection, properties);
    },
    /**
     * For front-end event-tracking - Sends event info to keen front-end-events collection. Collection: front-end-events.
     * Properties: interaction dictionary plus supplemental info in default keen payload
     *
     * @method keenTrackFrontEndEvent
     * @param {Object} event Dictionary with category, action, label
     * @param {Object} model Relevant model - node model if exists
     */
    keenTrackFrontEndEvent(event, model) {
        return this.keenTrackEvent('front-end-events', {
            interaction: {
                category: event.category || null,
                action: event.action || null,
                label: event.label || null
            }
        }, model);
    }
});
