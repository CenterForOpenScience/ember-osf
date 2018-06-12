/* eslint-disable no-unused-vars */
import Ember from 'ember';
import layout from './template';

import config from 'ember-get-config';
import moment from 'moment';
import QueryParams from 'ember-parachute';
import { task, timeout } from 'ember-concurrency';

import Analytics from '../../mixins/analytics';
import hostAppName from '../../mixins/host-app-name';
import { getUniqueList, getSplitParams, encodeParams } from '../../utils/elastic-query';

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
 *    activeFilters=activeFilters
 *    detailRoute=detailRoute
 *    discoverHeader=discoverHeader
 *    facets=facets
 *    fetchedProviders=model
 *    filterMap=filterMap
 *    filterReplace=filterReplace
 *    lockedParams=lockedParams
 *    page=page
 *    provider=provider
 *    q=q
 *    queryParams=queryParams
 *    searchPlaceholder=searchPlaceholder
 *    showActiveFilters=showActiveFilters
 *    sortOptions=sortOptions
 *    subject=subject
 *    themeProvider=themeProvider
* }}
 * ```
 * @class discover-page
 */

const MAX_SOURCES = 500;
const DEBOUNCE_MS = 250;

const elasticAggregations = {
    sources: {
        terms: {
            field: 'sources',
            size: MAX_SOURCES,
        },
    },
};

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
     * Primary filters for service - currently setup for PREPRINTS and REGISTRIES. Ember-SHARE's equivalent is facetStates.
     * @property {Object} activeFilters
     * @default { providers: [], subjects: [], types: [] }
     */
    activeFilters: { providers: [], subjects: [], types: [] },

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

    numberOfResults: 0,
    numberOfSources: 0,


    results: Ember.ArrayProxy.create({ content: [] }), // Results from SHARE query
    /**
     * For PREPRINTS and REGISTRIES.  Displays activeFilters box above search facets.
     * @property {boolean} showActiveFilters
     */
    showActiveFilters: false,

    showLuceneHelp: false,

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
    // COMPUTED PROPERTIES and OBSERVERS
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

    // facetStatesArray: Ember.computed(...filterQueryParamsList, function() {
    //     const facetArray = [];
    //     for (const param of filterQueryParamsList) {
    //         facetArray.push({ param, value: this.get('queryParamsState')[param].value });
    //     }
    //     return facetArray;
    // }),

    hiddenPages: Ember.computed('clampedPages', 'totalPages', function() {
        // LiveData property. Returns pages of hidden search results.
        const total = this.get('totalPages');
        const max = this.get('clampedPages');
        if (total !== max) {
            return total - max;
        }
        return null;
    }),

    providerChanged: Ember.on('init', Ember.observer('provider', function() {
        // For PREPRINTS and REGISTRIES - watches provider query param for changes and modifies activeFilters
        let filter = this.get('provider');
        if (!filter || filter === 'true' || typeof filter === 'object') return;
        if (!this.get('theme.isProvider')) {
            this.setActiveFiltersAndReload('activeFilters.providers', filter.split('OR'));
        }
    })),

    searchUrl: Ember.computed(function() {
        // Pulls SHARE search url from config file.
        const preference = this.get('currentUser.sessionKey');
        return `${config.OSF.shareSearchUrl}?preference=${preference}`;
    }),

    subjectChanged: Ember.on('init', Ember.observer('subject', function() {
        // For PREPRINTS - watches subject query param for changes and modifies activeFilters
        let filter = this.get('subject');
        if (!filter || filter === 'true' || typeof filter === 'object') return;
        this.setActiveFiltersAndReload('activeFilters.subjects', filter.split('OR'));
    })),

    typeChanged: Ember.on('init', Ember.observer('type', function() {
        // For REGISTRIES - watches type query param for changes and modifies activeFilters
        let filter = this.get('type');
        if (!filter || filter === 'true' || typeof filter === 'object') return;
        this.setActiveFiltersAndReload('activeFilters.types', filter.split('OR'));
    })),

    totalPages: Ember.computed('numberOfResults', 'queryParams.size', function() {
        // Total pages of search results
        return Math.ceil(this.get('numberOfResults') / this.get('queryParams.size'));
    }),

    actions: {
        addFilter(type, filterValue) {
            // Ember-SHARE action. Used to add filter from the search results.
            let currentValue = getSplitParams(this.get(type)) || [];
            let newValue = getUniqueList([filterValue].concat(currentValue));
            this.set(type, encodeParams(newValue));
        },

        // clearFilters() {
        //     // Clears facetFilters for SHARE-type facets
        //     this.set('facetFilters', Ember.Object.create());
        //     filterQueryParams.forEach(param => {
        //         this.set(param, '');
        //     });
        //     this.set('start', '');
        //     this.set('end', '');
        //     this.set('sort', '');
        //     this.search();
        //     // For PREPRINTS and REGISTRIES. Clears activeFilters.
        //     let restoreActiveFilters = {};
        //     Object.keys(this.get('activeFilters')).forEach(filter => {
        //         if (filter === 'providers') {
        //             restoreActiveFilters[filter] = this.get('theme.isProvider') ? this.get('activeFilters.providers') : [];
        //         } else {
        //             restoreActiveFilters[filter] = [];
        //         }

        //     });
        //     this.set('activeFilters', restoreActiveFilters);
        //     Ember.get(this, 'metrics')
        //         .trackEvent({
        //             category: 'button',
        //             action: 'click',
        //             label: 'Discover - Clear Filters'
        //         });
        // },

        filtersChanged() {
            // Ember SHARE action. Fired in faceted-search component when Ember-SHARE facets are modified.
            this.search();
        },

        // loadPage(newPage, scroll = true) {
        //     if (newPage === this.get('page') || newPage < 1 || newPage > this.get('totalPages')) {
        //         return;
        //     }
        //     this.set('page', newPage);
        //     if (scroll) {
        //         this.scrollToResults();
        //     }
        //     this.loadPage();
        // },

        modifyRegistrationType(filter, query) {
            // For REGISTRIES only - modifies "type" query param if "provider" query param changes.
            // Registries are unusual, since the OSF Registration Type facet depends upon the Providers facet
            if (filter === 'provider' && this.get('hostAppName') === 'Registries') {
                if (query.length === 1 && query[0] === 'OSF') {
                    this.set('type', this.get('activeFilters.types').join('OR'));
                } else {
                    this.set('type', '');
                    this.set('activeFilters.types', []);
                }
            }
        },

        removeFilter(type, filterValue) {
            // Ember-SHARE action.  Could be used to remove filters in Active Filters box (when Ember-SHARE and PREPRINTS/REGISTRIES code here is integrated)
            let currentValue = getSplitParams(this.get(type)) || [];
            let index = currentValue.indexOf(filterValue);
            if (index > -1) {
                currentValue.splice(index, 1);
            }
            currentValue = currentValue.length ? encodeParams(currentValue) : '';
            this.set(type, currentValue);
            this.get('facetFilters');
        },

        search() {
            // Only want to track search here when button clicked. Keypress search tracking is debounced in trackSearch
            Ember.get(this, 'metrics')
                .trackEvent({
                    category: 'button',
                    action: 'click',
                    label: 'Discover - Search',
                    extra: this.get('q')
                });

            this.search();
        },

        selectSortOption(option) {
            // Runs when sort option changed in dropdown
            this.set('sort', option);
            Ember.get(this, 'metrics')
                .trackEvent({
                    category: 'dropdown',
                    action: 'select',
                    label: `Sort by: ${option || 'relevance'}`
                });
            // this.search();
        },

        setLoadPage(pageNumber) {
            // Adapted from PREPRINTS for pagination. When paginating, sets page and scrolls to top of results.
            this.set('page', pageNumber);
            if (scroll) {
                this.scrollToResults();
            }
            // this.loadPage();
        },

        toggleShowLuceneHelp() {
            this.toggleProperty('showLuceneHelp');
        },

        updateFilters(filterType, item) {
            // For PREPRINTS and REGISTRIES.  Modifies activeFilters.
            item = typeof item === 'object' ? item.text : item;
            const filters = Ember.$.extend(true, Ember.A(), this.get(`activeFilters.${filterType}`));
            const hasItem = filters.includes(item);
            const action = hasItem ? 'remove' : 'push';
            filters[`${action}Object`](item);
            this.set(`activeFilters.${filterType}`, filters);
            this.send('updateQueryParams', filterType, filters);

            Ember.get(this, 'metrics')
                .trackEvent({
                    category: 'filter',
                    action: hasItem ? 'remove' : 'add',
                    label: `Discover - ${filterType} ${item}`
                });
        },

        updateParams(key, value) {
            // Ember SHARE action. Updates query params in URL.
            if (key === 'date') {
                this.set('start', value.start);
                this.set('end', value.end);
            } else {
                this.set(key, value);
            }
        },

        updateQueryParams(pluralFilter, query) {
            // For PREPRINTS and REGISTRIES.  Used to modify query parameters in URL when activeFilters change.
            const filter = Ember.String.singularize(pluralFilter);
            if (pluralFilter !== 'providers' || !this.get('theme.isProvider')) {
                this.set(`${filter}`, query.join('OR'));
                this.send('modifyRegistrationType', filter, query);
            }
        }
    },

    // ************************************************************
    // Discover-page METHODS and HOOKS
    // ************************************************************

    // buildLockedQueryBody(lockedParams) {
    //     /**
    //      *  For PREPRINTS, REGISTRIES, RETRACTION WATCH - services where portion of query is restricted.
    //      *  Builds the locked portion of the query.  For example, in preprints, types=['preprint', 'thesis']
    //      *  is something that cannot be modified by the user.
    //      *
    //      *  @method buildLockedQueryBody
    //      *  @param {Object} lockedParams - Locked param keys matched to the locked value.
    //      *  @return {Object} queryBody - locked portion of query body
    //     */
    //     let queryBody = [];
    //     Object.keys(lockedParams).forEach(key => {
    //         let query = {};
    //         let queryKey = [`${key}`];
    //         if (key === 'tags') {
    //             queryKey = key;
    //         } else if (key === 'contributors') {
    //             queryKey = 'lists.contributors.name';
    //         }
    //         query[queryKey] = lockedParams[key];
    //         if (key === 'bool') {
    //             queryBody.push(query);
    //         } else {
    //             queryBody.push({
    //                 terms: query
    //             });
    //         }
    //     });
    //     return queryBody;
    // },

    // getQueryBody(queryParams) {
    //     /**
    //      * Builds query body to send to SHARE from a combination of locked Params, facetFilters and activeFilters
    //      *
    //      * @method getQueryBody
    //      * @return queryBody
    //      */
    //     let filters = this.buildLockedQueryBody(this.get('lockedParams')); // Empty list if no locked query parameters
    //     // From Ember-SHARE. Looks at facetFilters (partial SHARE queries already built) and adds them to query body
    //     let facetFilters = this.get('facetFilters');
    //     for (let k of Object.keys(facetFilters)) {
    //         let filter = facetFilters[k];
    //         if (filter) {
    //             if (Ember.$.isArray(filter)) {
    //                 filters = filters.concat(filter);
    //             } else {
    //                 filters.push(filter);
    //             }
    //         }
    //     }

    //     // For PREPRINTS and REGISTRIES.  Adds activeFilters to query body.
    //     const activeFilters = this.get('activeFilters');
    //     const filterMap = this.get('filterMap');
    //     Object.keys(filterMap).forEach(key => {
    //         const val = filterMap[key];
    //         const filterList = activeFilters[key];
    //         this.set(key, filterList.join('OR'));

    //         if (!filterList.length || (key === 'providers' && this.get('theme.isProvider')))
    //             return;

    //         if (val == 'subjects') {
    //             var matched = [];
    //             for (let filter of filterList) {
    //                 matched.push({
    //                     match: {
    //                         [val]: filter
    //                     }
    //                 });
    //             }

    //             filters.push({
    //                 bool: {
    //                     should: matched
    //                 }
    //             });
    //         } else {
    //             filters.push({
    //                 terms: {
    //                     [val]: filterList
    //                 }
    //             });
    //         }
    //     });
    //     // For PREPRINTS and REGISTRIES. If theme.isProvider, add provider(s) to query body
    //     if (this.get('themeProvider')) {
    //         const themeProvider = this.get('themeProvider');
    //         // Regular preprint providers will have their search results restricted to the one provider.
    //         // If the provider has additionalProviders, all of these providers will be added to the "sources" SHARE query
    //         var sources = [];
    //         if (this.get('theme.isProvider'))
    //             sources = (themeProvider.get('additionalProviders') || []).length ? themeProvider.get('additionalProviders') : [themeProvider.get('shareSource') || themeProvider.get('name')];
    //         else if (this.get('themeProvider.id') === 'osf') {
    //             let osfProviderSources = [themeProvider.get('shareSource') || 'OSF'];
    //             osfProviderSources = osfProviderSources.concat(
    //               this.get('fetchedProviders').map(provider => provider.get('shareSource') || provider.get('name'))
    //             );
    //             sources = this.get('whiteListedProviders') ? osfProviderSources.concat(this.get('whiteListedProviders')) : osfProviderSources;
    //         }
    //         filters.push({
    //             terms: {
    //                 sources: sources
    //             }
    //         });
    //     }

    //     let query = {
    //         query_string: {
    //             query: queryParams.q || '*'
    //         }
    //     };

    //     if (filters.length) {
    //         query = {
    //             bool: {
    //                 must: query,
    //                 filter: filters
    //             }
    //         };
    //     }

    //     let page = this.get('page');
    //     let queryBody = {
    //         query,
    //         from: (page - 1) * this.get('size')
    //     };

    //     if (this.get('sort')) {
    //         let sortBy = {};
    //         sortBy[this.get('sort').replace(/^-/, '')] = this.get('sort')[0] === '-' ? 'desc' : 'asc';
    //         queryBody.sort = sortBy;
    //     }

    //     if (page === 1 || this.get('firstLoad')) {
    //         queryBody.aggregations = this.get('elasticAggregations');
    //     }

    //     return this.set('queryBody', queryBody);
    // },

    // loadPage() {
    //     let queryBody = JSON.stringify(this.getQueryBody());
    //     this.set('loading', true);
    //     let jqDeferred = Ember.$.ajax({
    //         url: this.get('searchUrl'),
    //         crossDomain: true,
    //         type: 'POST',
    //         contentType: 'application/json',
    //         data: queryBody
    //     }).then((json) => {
    //         if (this.isDestroyed || this.isDestroying) return;
    //         if (queryBody !== JSON.stringify(this.getQueryBody())) return; //Safeguard: if query has changed since request was sent, dont update results


    //         if (json.aggregations) {
    //             this.set('aggregations', json.aggregations);
    //         }
    //         this.setProperties({
    //             numberOfResults: json.hits.total,
    //             took: moment.duration(json.took).asSeconds(),
    //             loading: false,
    //             firstLoad: false,
    //             results: results,
    //             queryError: false,
    //             shareDown: false,
    //         });
    //         if (this.get('totalPages') && this.get('totalPages') < this.get('page')) {
    //             this.search();
    //         }
    //     }).fail((errorResponse) => {
    //         this.setProperties({
    //             loading: false,
    //             firstLoad: false,
    //             numberOfResults: 0,
    //             results: []
    //         });
    //         if (errorResponse.status === 400) {
    //             // If issue with search query, for example, invalid lucene search syntax
    //             this.set('queryError', true);
    //         } else {
    //             // SHARE is Down
    //             this.set('shareDown', true);
    //         }
    //     });
    //     return new Ember.RSVP.Promise((resolve, reject) => {
    //         jqDeferred.done((value) => resolve(value));
    //         jqDeferred.fail((reason) => reject(reason));
    //     });
    // },

    scrollToResults() {
        // Scrolls to top of search results
        Ember.$('html, body').scrollTop(this.$('.results-top').position().top);
    },

    search() {
        if (!this.get('firstLoad')) {
            this.set('page', 1);
        }
        // this.set('loading', true);
        this.set('results', []);
        // Ember.run.debounce(this, this.loadPage, 500);
    },

    setActiveFiltersAndReload(activeFilterName, proposedFilters) {
        // If activeFilter is not equal to proposedFilter, update the activeFilter and reload search
        const currentFilters = this.get(activeFilterName);
        if (Ember.compare(currentFilters, proposedFilters) !== 0) {
            this.set(activeFilterName, proposedFilters);
            // this.loadPage();
        }
    },

    trackDebouncedSearch() {
        // For use in tracking debounced search of registries in Keen and GA
        Ember.get(this, 'metrics')
            .trackEvent({
                category: 'input',
                action: 'onkeyup',
                label: 'Discover - Search',
                extra: this.get('q')
            });
    },

    // constructFacetFilters() {
    //     const filters = {};
    //     this.get('facets').forEach((facet) => {
    //         const filterType = facet.filter || 'termsFilter';
    //         const field = facet.filterName || facet.paramName;

    //         let terms = null;
    //         let start = null;
    //         let end = null;

    //         if (filterType === 'dateRangeFilter') {
    //             start = this.get('queryParamsState').start.value;
    //             end = this.get('queryParamsState').end.value;
    //         } else {
    //             terms = this.get('queryParamsState')[field].value;
    //         }

    //         filters[field] = getFilter(field, filterType, terms, start, end);
    //     });

    //     return filters;
    // },

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
            url: this.get('searchUrl'),
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
        //TODO Sort initial results on date_modified
        // Runs on initial render.
        this._super(...arguments);
        // this.set('firstLoad', true);
        // this.set('facetFilters', Ember.Object.create());

        // this.get('getTypes').perform();
        this.get('getCounts').perform();
        // this.loadPage();
    },
});
