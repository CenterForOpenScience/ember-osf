import Ember from 'ember';
import layout from './template';

import config from 'ember-get-config';
import { task } from 'ember-concurrency';

import Analytics from '../../mixins/analytics';
import hostAppName from '../../mixins/host-app-name';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 *  Discover-page component. Builds a search interface utilizing SHARE.
 *  See retraction-watch, registries, and preprints discover pages for working examples.
 *
 *  Majority adapted from Ember-SHARE https://github.com/CenterForOpenScience/ember-share, with additions from PREPRINTS
 *  and REGISTRIES discover pages. Original Ember-SHARE facets and PREPRINTS/REGISTRIES facets behave differently at this time.
 *  You can build a discover-page that uses Ember-SHARE type facets -OR- PREPRINTS/REGISTRIES type facets.  Would not recommend
 *  mixing until code is combined.
 *
 *  How to Use:
 *  Pass in custom text like searchPlaceholder.  The facets property will enable you to customize the filters
 *  on the left-hand side of the discover page. Sort options are the sort dropdown options.  The lockedParams are the
 *  query parameters that are always locked in your application. Each query parameter must be passed in individually,
 *  so they are reflected in the URL.  Logo and custom colors must be placed in the consuming application's stylesheet. Individual components
 *  can additionally be overridden in your application.
 *
 * Sample usage:
 * ```handlebars
 *{{discover-page
 *    consumingService=consumingService
 *    searchPlaceholder=searchPlaceholder
 *    detailRoute=detailRoute
 *    discoverHeader=discoverHeader
 *    themeProvider=themeProvider
 *
 *    sortOptions=sortOptions
 *    filterMap=filterMap
 *    filterReplace=filterReplace
 *    lockedParams=lockedParams
 *    whiteListedProviders=whiteListedProviders
 *    fetchedProviders=externalProviders
 *
 *    facets=facets
 *    results=results
 *    numberOfResults=numberOfResults
 *    aggregations=aggregations
 *    queryParamsState=queryParamsState
 *
 *    showActiveFilters=showActiveFilters
 *    loading=fetchData.isRunning
 *
 *    clearFilters=(action 'clearFilters')
 *    search=(action 'search')
 * }}
 * {{!-- plus any query params (e.g. provider=provider) --}}
 * ```
 * @class discover-page
 */

const MAX_SOURCES = 500;

export default Ember.Component.extend(Analytics, hostAppName, {
    layout,
    currentUser: Ember.inject.service('current-user'),
    theme: Ember.inject.service(),
    i18n: Ember.inject.service(),

    classNames: ['discover-page'],

    // ************************************************************
    // PROPERTIES
    // ************************************************************

    /**
     * Name of detail route for consuming application, like "content" or "detail". Override if search result title should link to detail route.
     * @property {String} detailRoute
     */
    detailRoute: null,

    /**
     * Text header for top of discover page.
     * @property {String} discoverHeader
     */
    discoverHeader: null,


    /**
     * For PREPRINTS ONLY.  Pass in the providers fetched in preprints app so they can be used in the provider carousel
     * @property {Object} fetchedProviders
     */
    fetchedProviders: null,

    /**
     * For PREPRINTS and REGISTRIES. A mapping of activeFilters to facet names expected by SHARE. Ex. {'providers': 'sources'}
     * @property {Object} filterMap
     */
    filterMap: {},
    /**
     * For PREPRINTS and REGISTRIES. A mapping of filter names for front-end display. Ex. {OSF: 'OSF Preprints'}.
     * @property {Object} filterReplace
     */
    filterReplace: {},

    /**
     * Locked portions of search query that user cannot change.  Example: {'sources': 'PubMed Central'} will make PMC a locked source.
     * @property {Object} lockedParams
     */
    lockedParams: {},

    /**
     * For PREPRINTS and REGISTRIES.  Displays activeFilters box above search facets.
     * @property {boolean} showActiveFilters
     */
    showActiveFilters: false,

    showLuceneHelp: false,

    numberOfResults: 0,
    numberOfSources: 0,

    results: Ember.ArrayProxy.create({ content: [] }), // Results from SHARE query

    /**
     * Sort dropdown options - Array of dictionaries.  Each dictionary should have display and sortBy keys.
     * @property {Array} sortOptions
     * @default [{
        display: 'Relevance',
        sortBy: ''
       }]
     */
    sortOptions: [{
        display: 'Relevance',
        sortBy: ''
    }, {
        display: 'Date Updated (Desc)',
        sortBy: '-date_updated'
    }, {
        display: 'Date Updated (Asc)',
        sortBy: 'date_updated'
    }, {
        display: 'Ingest Date (Asc)',
        sortBy: 'date_created'
    }, {
        display: 'Ingest Date (Desc)',
        sortBy: '-date_created'
    }],

    /**
     * themeProvider
     * @property {Object} Preprint provider loaded from theme service. Should be passed from consuming service so it is loaded before SHARE is queried.
     * @default ''
     */
    themeProvider: null,


    // ************************************************************
    // COMPUTED PROPERTIES
    // ************************************************************

    domainRedirectProviders: Ember.computed(function() {
        let providerDomains = [];
        let providers = this.get('fetchedProviders');
        for (let providerVal of providers) {
            if (providerVal.get('domain') && providerVal.get('domainRedirectEnabled') === true) {
                providerDomains.push(providerVal.get('domain'));
            }
        }
        return providerDomains;
    }),

    clampedPages: Ember.computed('totalPages', 'size', function() {
        // requesting over 10000 will error due to elastic limitations
        // https://www.elastic.co/guide/en/elasticsearch/guide/current/pagination.html
        let maxPages = Math.ceil(10000 / this.get('size'));
        let totalPages = this.get('totalPages');

        return totalPages < maxPages ? totalPages : maxPages;
    }),

    totalPages: Ember.computed('numberOfResults', 'size', function() {
        // Total pages of search results
        return Math.ceil(this.get('numberOfResults') / this.get('size'));
    }),

    actions: {
        clearFilters() {
            this.get('metrics').trackEvent({
                category: 'button',
                action: 'click',
                label: 'Discover - Clear Filters',
            });

            this.get('clearFilters')();
        },

        search() {
            this.get('metrics').trackEvent({
                category: 'button',
                action: 'click',
                label: 'Discover - Search',
                extra: this.get('q'),
            });

            this.get('search')();
        },

        selectSortOption(option) {
            // Runs when sort option changed in dropdown
            this.get('metrics').trackEvent({
                category: 'dropdown',
                action: 'select',
                label: `Sort by: ${option || 'relevance'}`
            });

            this.set('sort', option);
        },

        selectPage(pageNumber) {
            // When paginating, sets page and scrolls to top of results.
            this.set('page', pageNumber);
            if (scroll) {
                this.scrollToResults();
            }
        },

        toggleShowLuceneHelp() {
            this.toggleProperty('showLuceneHelp');
        },

        updateFilters(filterType, item) {
            item = typeof item === 'object' ? item.text : item;
            const currentState = this.get(`queryParamsState.${filterType}.value`);
            const hasItem = currentState.includes(item);

            if (hasItem) {
                this.set(filterType, currentState.filter(x => !item.includes(x)));
            } else {
                currentState.pushObject(item)
                this.set(filterType, currentState);
            }

            this.get('metrics').trackEvent({
                category: 'filter',
                action: hasItem ? 'remove' : 'add',
                label: `Discover - ${filterType} ${item}`
            });
        },

        updateParams(key, value) {
            this.set(key, value);
        },
    },

    // ************************************************************
    // Discover-page METHODS and HOOKS
    // ************************************************************

    scrollToResults() {
        // Scrolls to top of search results
        Ember.$('html, body').scrollTop(this.$('.results-top').position().top);
    },

    isTypeFacet(obj) {
        return obj.key === 'type';
    },

    getTypes: task(function* () {
        const response = yield Ember.$.ajax({
            url: `${config.OSF.shareApiUrl}/schema/creativework/hierarchy/`,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/vnd.api+json',
        });
        if (response.data) {
            const types = response.data.CreativeWork ? response.data.CreativeWork.children : {};
            this.get('facets').find(this.isTypeFacet).data = this.transformTypes(types);
        }
    }),

    transformTypes(types) {
        const tmpTypes = types;
        if (typeof (tmpTypes) !== 'object') {
            return tmpTypes;
        }

        for (const key of Object.keys(tmpTypes)) {
            const lowKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
            tmpTypes[lowKey] = this.transformTypes(tmpTypes[key]);
            if (key !== lowKey) {
                delete tmpTypes[key];
            }
        }

        return tmpTypes;
    },

    getCounts: task(function* () {
        const searchUrl = `${config.OSF.shareSearchUrl}?preference=${this.get('currentUser.sessionKey')}`;
        const queryBody = JSON.stringify({
            size: 0,
            aggregations: {
                sources: {
                    cardinality: {
                        field: 'sources',
                        precision_threshold: MAX_SOURCES,
                    },
                },
            },
        });
        const response = yield Ember.$.ajax({
            url: searchUrl,
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody,
        });
        this.setProperties({
            numberOfEvents: response.hits.total,
            numberOfSources: response.aggregations.sources.value,
        });
    }),

    init() {
        // TODO Sort initial results on date_modified
        // Runs on initial render.
        this._super(...arguments);

        this.get('getTypes').perform();
        this.get('getCounts').perform();
    },
});
