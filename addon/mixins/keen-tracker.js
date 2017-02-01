import Ember from 'ember';
import md5 from 'npm:js-md5';
import _get from 'npm:lodash/get';
import Cookie from 'npm:js-cookie';
import config from 'ember-get-config';
import keenTracking from 'npm:keen-tracking';

// Adapted from website/static/js/keen.js
export default Ember.Mixin.create({
    session: Ember.inject.service(),
    // Add this mixin to your route, and the beforeModel hook will send pageviews to keen
    // TODO add node to context vars, if exists?
    beforeModel(transition) {
        let data = {
            page: transition.get('targetName'),
            queryParams: transition.get('queryParams')
            page: transition.targetName,
            queryParams: transition.queryParams
        };
        return this.KeenTracker().getInstance().trackPageView(data);
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
            Cookie.set('keenSessionId', currentSessionId, {expires: expDate, path: '/'});
        }

        function _getOrCreateKeenId() {
            if (!Cookie.get('keenUserId')) {
                Cookie.set('keenUserId', keenTracking.helpers.getUniqueId(), {expires: 365, path: '/'});
            }
            return Cookie.get('keenUserId');
        }


        function _defaultKeenPayload() {
            _createOrUpdateKeenSession();

            var user = window.contextVars.currentUser;
            var node = window.contextVars.node;
            var pageMeta = _get(window, 'contextVars.analyticsMeta.pageMeta', {}); // Is there any way to get this??
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
            client.recordEvent(collection, eventData, function (err) {
                if (err) {
                    console.log(err);
                    // Raven.captureMessage('Error sending Keen data to ' + collection + ': <' + err + '>', {
                    //     extra: {payload: eventData}
                    // });
                }
            });
        }

        function _trackCustomEvents(client, events) {
            if (client === null) {
                return;
            }
            client.recordEvents(events, function (err, res) {
                if (err) {
                    // Raven.captureMessage('Error sending Keen data for multiple events: <' + err + '>', {
                    //     extra: {payload: events}
                    // });
                } else {
                    for (var collection in res) {
                        var results = res[collection];
                        for (var idx in results) {
                            if (!results[idx].success) {
                                // Raven.captureMessage('Error sending Keen data to ' + collection + '.', {
                                //     extra: {payload: events[collection][idx]}
                                // });
                            }
                        }
                    }
                }
            });
        }

        function KeenTracker() {
            if (instance) {
                throw new Error('Cannot instantiate another KeenTracker instance.');
            } else {
                var self = this;

                self._publicClient = null;
                self._privateClient = null;

                self.init = function _initKeentracker(params) {
                    var self = this;

                    if (params === undefined) {
                        return self;
                    }

                    self._publicClient = keenTracking({
                        projectId: params.public.projectId,
                        writeKey: params.public.writeKey,
                    });
                    self._publicClient.extendEvents(_defaultPublicKeenPayload);

                    self._privateClient = keenTracking({
                        projectId: params.private.projectId,
                        writeKey: params.private.writeKey,
                    });
                    self._privateClient.extendEvents(_defaultPrivateKeenPayload);

                    return self;
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

                self.trackPageView = function (data) {
                    var self = this;
                    if (_get(window, 'contextVars.node.isPublic', false) &&
                        _get(window, 'contextVars.analyticsMeta.pageMeta.public', false)) {
                        self.trackPublicEvent('pageviews', data);
                    }
                    self.trackPrivateEvent('pageviews', data);
                };

                self.trackPrivateEvent = function(collection, event) {
                    return _trackCustomEvent(self._privateClient, collection, event);
                };
                self.trackPrivateEvents = function(events) {
                    return _trackCustomEvents(self._privateClient, events);
                };

                self.trackPublicEvent = function(collection, event) {
                    return _trackCustomEvent(self._publicClient, collection, event);
                };
                self.trackPublicEvents = function(events) {
                    return _trackCustomEvents(self._publicClient, events);
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
                entry_point: userInfo.attributes.entry_point,
                institutions: null, // Don't really want to make an API request to fetch user institutions.
                locale: userInfo.attributes.locale,
                timezone: userInfo.attributes.timezone
            };
        }
        user.anon = {}; // Can I get this info?
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
    keenTrackEvent(event_collection, properties, node) {
        // Adds context vars and sends keen trackPrivateEvent method
        window.contextVars = {};
        window.contextVars.currentUser = this.userContextVars();
        window.contextVars.node = this.nodeContextVars(node);
        return this.KeenTracker().getInstance().trackPrivateEvent(event_collection, properties);
    },
    /**
     * For front-end event-tracking - Sends event to keen. Collection: front-end-events. Properties:
     * interaction dictionary plus supplement info like OSF
     *
     * @method keenTrackFrontEndEvent
     * @param {Object} event Dictionary with category, action, label
     * @param {Object} node Node model, if exists
     */
    keenTrackFrontEndEvent(event, node) {
        return this.keenTrackEvent('front-end-events', {
            interaction: {
                category: event.category || null,
                action: event.action || null,
                label: event.label || null
            }
        }, node);
    }
});
