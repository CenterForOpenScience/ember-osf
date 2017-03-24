import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';
import moment from 'moment';
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
 *  can additionally be overridden in your application.  Your searchUrl must be defined in your config/environment.js file.
 *
 * Sample usage:
 * ```handlebars
 *{{discover-page
 *    activeFilters=activeFilters
 *    clearFiltersButton=clearFiltersButton
 *    consumingService=consumingService
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
 *    searchButton=searchButton
 *    searchPlaceholder=searchPlaceholder
 *    showActiveFilters=showActiveFilters
 *    sortOptions=sortOptions
 *    subject=subject
* }}
 * ```
 * @class discover-page
 */

const MAX_SOURCES = 500;
let filterQueryParams = ['subject', 'provider', 'tags', 'sources', 'publishers', 'funders', 'institutions', 'organizations', 'language', 'contributors', 'type'];

export default Ember.Component.extend({
    layout,
    theme: Ember.inject.service(),
    i18n: Ember.inject.service(),
    classNames: ['discover-page'],
    // ************************************************************
    // PROPERTIES
    // ************************************************************
    activeFilters: { providers: [], subjects: [], types: [] }, // Active filters - currently for PREPRINTS and REGISTRIES.  Ember-SHARE's equivalent is facetStates.
    clearFiltersButton: Ember.computed('i18n.locale', function() { // Text for clearFilters button. Can override in consuming application.
        return this.get('i18n').t('eosf.components.discoverPage.activeFilters.button');
    }),
    consumingService: null, // Consuming service, like "preprints" or "registries". TODO Need to pull from config instead.
    contributors: '', // Query parameter
    detailRoute: null, // Name of detail route for consuming application, like "content" or "detail". Override if search result title should link to detail route.
    discoverHeader: null, // Text header for top of discover page
    end: '', // Query parameter
    facets: Ember.computed('processedTypes', function() {  // Default search facets (from Ember-SHARE) - pass in as property to component.
        return [
            { key: 'sources', title: 'Source', component: 'search-facet-source' },
            { key: 'date', title: 'Date', component: 'search-facet-daterange' },
            { key: 'type', title: 'Type', component: 'search-facet-worktype', data: this.get('processedTypes') },
            { key: 'tags', title: 'Tag', component: 'search-facet-typeahead' },
            { key: 'publishers', title: 'Publisher', component: 'search-facet-typeahead', base: 'agents', type: 'publisher' },
            { key: 'funders', title: 'Funder', component: 'search-facet-typeahead', base: 'agents', type: 'funder' },
            { key: 'language', title: 'Language', component: 'search-facet-language' },
            { key: 'contributors', title: 'People', component: 'search-facet-typeahead', base: 'agents', type: 'person' },
        ];
    }),
    facetStatesArray: [], // Ember-SHARE property.  Modified when query params in URL change.
    filterMap: {}, // For PREPRINTS and REGISTRIES. A mapping of activeFilters to facet names expected by SHARE. Ex. {'providers': 'sources'}
    filterReplace: {},  // For PREPRINTS and REGISTRIES. A mapping of filter names for front-end display. Ex. {OSF: 'OSF Preprints'}
    funders: '', // Query parameter
    institutions: '', // Query parameter
    language: '', // Query parameter
    loading: true,
    lockedParams: {}, // Locked portions of search query that user cannot change.  Example: {'sources': 'PubMed Central'} will make PMC a locked source.
    noResults: Ember.computed('i18n.locale', function() { // Text to display if no results found
        return this.get('i18n').t('eosf.components.discoverPage.broadenSearch');
    }),
    numberOfResults: 0,  // Number of search results returned
    numberOfSources: 0, // Number of sources
    organizations: '', // Query parameter
    page: 1, // Query parameter
    poweredBy: Ember.computed('i18n.locale', function() { // Powered by text
        return this.get('i18n').t('eosf.components.discoverPage.poweredBy');
    }),
    publishers: '', // Query parameter
    provider: '', // Query parameter
    providerName: null, // For PREPRINTS and REGISTRIES. Provider name, if theme.isProvider, ex: psyarxiv
    q: '', // Query parameter
    queryParams:  Ember.computed(function() { // Query params.  Declare on consuming application's controller for query params to be active in that route.
        let allParams = ['q', 'start', 'end', 'sort', 'page'];
        allParams.push(...filterQueryParams);
        return allParams;
    }),
    results: Ember.ArrayProxy.create({ content: [] }), // Results from SHARE query
    searchButton: Ember.computed('i18n.locale', function() { // Search button text
        return this.get('i18n').t('eosf.components.discoverPage.search');
    }),
    searchPlaceholder: Ember.computed('i18n.locale', function() { // Search bar placeholder text
        return this.get('i18n').t('eosf.components.discoverPage.searchPlaceholder');
    }),
    shareTotalText: Ember.computed('i18n.locale', function() {
        return this.get('i18n').t('eosf.components.discoverPage.shareTotalText');
    }),
    showActiveFilters: false, // For PREPRINTS and REGISTRIES.  Displays activeFilters box above search facets.
    showLuceneHelp: false, // Is Lucene Search help modal open?
    size: 10, // Query parameter
    sort: '', // Query parameter
    sortOptions: [{ // Default sort options, can override
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
    sources: '', // Query parameter
    start: '', // Query parameter
    subject: '', // Query parameter
    tags: '', // Query parameter
    took: 0,
    type: '', // Query parameter

    // ************************************************************
    // COMPUTED PROPERTIES and OBSERVERS
    // ************************************************************

    // TODO update this property if a solution is found for the elastic search limitation.
    // Ticket: SHARE-595
    clampedPages: Ember.computed('totalPages', 'size', function() {
        // Total pages of search results, unless total is greater than the max pages allowed.
        let maxPages = Math.ceil(10000 / this.get('size'));
        let totalPages = this.get('totalPages');
        return totalPages < maxPages ? totalPages : maxPages;
    }),
    elasticAggregations: Ember.computed(function() {
        // Ember-SHARE property.
        return {
            sources: {
                terms: {
                    field: 'sources',
                    size: MAX_SOURCES
                }
            }
        };
    }),
    facetStates: Ember.computed(...filterQueryParams, 'end', 'start', function() {
        // Ember-SHARE property.  Watches query params in URL and modifies facetStates
        let facetStates = {};
        for (let param of filterQueryParams) {
            facetStates[param] = getSplitParams(this.get(param));
        }
        facetStates.date = { start: this.get('start'), end: this.get('end') };

        Ember.run.once(this, function() {
            let facets = this.get('facetStates');
            let facetArray = [];
            for (let key of Object.keys(facets)) {
                facetArray.push({ key: key, value: facets[key] });
            }
            this.set('facetStatesArray', facetArray);
        });
        return facetStates;
    }),
    hiddenPages: Ember.computed('clampedPages', 'totalPages', function() {
        // Ember-SHARE property. Returns pages of hidden search results.
        const total = this.get('totalPages');
        const max = this.get('clampedPages');
        if (total !== max) {
            return total - max;
        }
        return null;
    }),
    noResultsMessage: Ember.computed('numberOfResults', function() {
        // Property that determines if no results message should be displayed to user
        return this.get('numberOfResults') > 0 ? '' : this.get('noResults');
    }),
    providerChanged: Ember.on('init', Ember.observer('provider', function() {
        // For PREPRINTS and REGISTRIES - watches provider query param for changes and modifies activeFilters
        let filter = this.get('provider');
        if (!filter || filter === 'true' || typeof filter === 'object') return;
        if (!this.get('theme.isProvider')) {
            this.set(`activeFilters.providers`, filter.split('OR'));
            this.notifyPropertyChange('activeFilters');
            this.loadPage();
        }
    })),
    processedTypes: Ember.computed('types', function() {
        // Ember-SHARE property
        return this.transformTypes(this.get('types'));
    }),
    reloadSearch: Ember.observer('activeFilters', function() {
        // For PREPRINTS and REGISTRIES.  Reloads page if activeFilters change.
        this.set('page', 1);
        this.loadPage();
    }),
    searchUrl: Ember.computed(function() {
        // Pulls SHARE search url from config file.
        return config.SHARE.searchUrl;
    }),
    subjectChanged: Ember.on('init', Ember.observer('subject', function() {
        // For PREPRINTS - watches subject query param for changes and modifies activeFilters
        let filter = this.get('subject');
        if (!filter || filter === 'true' || typeof filter === 'object') return;
        this.set(`activeFilters.subjects`, filter.split('OR'));
        this.notifyPropertyChange('activeFilters');
        this.loadPage();
    })),
    typeChanged: Ember.on('init', Ember.observer('type', function() {
        // For REGISTRIES - watches type query param for changes and modifies activeFilters
        let filter = this.get('type');
        if (!filter || filter === 'true' || typeof filter === 'object') return;
        this.set(`activeFilters.types`, filter.split('OR'));
        this.notifyPropertyChange('activeFilters');
        this.loadPage();
    })),
    totalPages: Ember.computed('numberOfResults', 'size', function() {
        // Total pages of search results
        return Math.ceil(this.get('numberOfResults') / this.get('size'));
    }),

    // ************************************************************
    // Discover-page METHODS and HOOKS
    // ************************************************************

    buildLockedQueryBody(lockedParams) {
        /**
         *  For PREPRINTS, REGISTRIES, RETRACTION WATCH - services where portion of query is restricted.
         *  Builds the locked portion of the query.  For example, in preprints, type=preprint
         *  is something that cannot be modified by the user.
         *
         *  Takes in a dictionary of locked param keys matched to the locked value.
        */
        let queryBody = [];
        Object.keys(lockedParams).forEach(key => {
            let query = {};
            let queryKey = [`${key}`];
            if (key === 'tags') {
                queryKey = key;
            } else if (key === 'contributors') {
                queryKey = 'lists.contributors.name';
            }

            query[queryKey] = lockedParams[key];
            queryBody.push({
                term: query
            });
        });
        return queryBody;
    },
    getCounts() {
        // Ember-SHARE method
        let queryBody = JSON.stringify({
            size: 0,
            aggregations: {
                sources: {
                    cardinality: {
                        field: 'sources',
                        precision_threshold: MAX_SOURCES
                    }
                }
            }
        });
        return Ember.$.ajax({
            url: this.get('searchUrl'),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody
        }).then((json) => {
            this.setProperties({
                numberOfEvents: json.hits.total,
                numberOfSources: json.aggregations.sources.value
            });
        });
    },
    getQueryBody() {
        // Builds query body for SHARE
        let filters = this.buildLockedQueryBody(this.get('lockedParams')); // Empty list if no locked query parameters
        // From Ember-SHARE. Looks at facetFilters (partial SHARE queries already built) and adds them to query body
        let facetFilters = this.get('facetFilters');
        for (let k of Object.keys(facetFilters)) {
            let filter = facetFilters[k];
            if (filter) {
                if (Ember.$.isArray(filter)) {
                    filters = filters.concat(filter);
                } else {
                    filters.push(filter);
                }
            }
        }

        // For PREPRINTS and REGISTRIES.  Adds activeFilters to query body.
        const activeFilters = this.get('activeFilters');
        const filterMap = this.get('filterMap');
        for (const key in filterMap) {
            const val = filterMap[key];
            const filterList = activeFilters[key];

            if (!filterList.length || (key === 'providers' && this.get('theme.isProvider')))
                continue;

            filters.push({
                terms: {
                    [val]: filterList
                }
            });
        }

        // For PREPRINTS and REGISTRIES. If theme.isProvider, add this provider to the query body
        if (this.get('theme.isProvider') && this.get('providerName') !== null) {
            filters.push({
                terms: {
                    sources: [this.get('providerName')]
                }
            });
        }

        let query = {
            query_string: {
                query: this.get('q') || '*'
            }
        };
        if (filters.length) {
            query = {
                bool: {
                    must: query,
                    filter: filters
                }
            };
        }

        let page = this.get('page');
        let queryBody = {
            query,
            from: (page - 1) * this.get('size')
        };
        if (this.get('sort')) {
            let sortBy = {};
            sortBy[this.get('sort').replace(/^-/, '')] = this.get('sort')[0] === '-' ? 'desc' : 'asc';
            queryBody.sort = sortBy;
        }
        if (page === 1 || this.get('firstLoad')) {
            queryBody.aggregations = this.get('elasticAggregations');
        }

        this.set('displayQueryBody', { query });
        return this.set('queryBody', queryBody);
    },
    getTypes() {
        // Ember-SHARE method
        return Ember.$.ajax({
            url: config.SHARE.apiUrl + '/schema/creativework/hierarchy/',
            crossDomain: true,
            type: 'GET',
            contentType: 'application/vnd.api+json',
        }).then((json) => {
            if (json.data) {
                this.set('types', json.data);
            }
        });
    },
    init() {
        //TODO Sort initial results on date_modified
        // Runs on initial render.
        this._super(...arguments);
        this.set('firstLoad', true);
        this.set('facetFilters', Ember.Object.create());
        this.getTypes();
        this.set('debouncedLoadPage', this.loadPage.bind(this));
        this.getCounts();
        this.loadProvider();
        this.loadPage();
    },
    loadPage() {
        let queryBody = JSON.stringify(this.getQueryBody());
        this.set('loading', true);
        return Ember.$.ajax({
            url: this.get('searchUrl'),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody
        }).then((json) => {
            if (this.isDestroyed || this.isDestroying) return;
            let results = json.hits.hits.map(hit => {
                // HACK: Make share data look like apiv2 preprints data
                let result = Ember.merge(hit._source, {
                    id: hit._id,
                    type: 'elastic-search-result',
                    workType: hit._source['@type'],
                    abstract: hit._source.description,
                    subjects: hit._source.subjects.map(each => ({ text: each })),
                    providers: hit._source.sources.map(item => ({ name: item })), // For PREPRINTS, REGISTRIES
                    hyperLinks: [// Links that are hyperlinks from hit._source.lists.links
                        {
                            type: 'share',
                            url: config.SHARE.baseUrl + 'preprint/' + hit._id
                        }
                    ],
                    infoLinks: [], // Links that are not hyperlinks  hit._source.lists.links
                    registrationType: hit._source.registration_type // For REGISTRIES
                });

                hit._source.identifiers.forEach(function(identifier) {
                    if (identifier.startsWith('http://')) {
                        result.hyperLinks.push({ url: identifier });
                    } else {
                        const spl = identifier.split('://');
                        const [type, uri, ..._] = spl; // jshint ignore:line
                        result.infoLinks.push({ type, uri });
                    }
                });

                result.contributors = result.lists.contributors ? result.lists.contributors
                  .sort((b, a) => (b.order_cited || -1) - (a.order_cited || -1))
                  .map(contributor => ({
                        users: Object.keys(contributor)
                          .reduce(
                              (acc, key) => Ember.merge(acc, { [key.camelize()]: contributor[key] }),
                              { bibliographic: contributor.relation !== 'contributor' }
                          )
                    })) : [];

                // Temporary fix to handle half way migrated SHARE ES
                // Only false will result in a false here.
                result.contributors.map(contributor => contributor.users.bibliographic = !(contributor.users.bibliographic === false));  // jshint ignore:line

                return result;
            });

            if (json.aggregations) {
                this.set('aggregations', json.aggregations);
            }
            this.setProperties({
                numberOfResults: json.hits.total,
                took: moment.duration(json.took).asSeconds(),
                loading: false,
                firstLoad: false,
                results: results,
                queryError: false,
                shareDown: false,
            });
            if (this.get('totalPages') && this.get('totalPages') < this.get('page')) {
                this.search();
            }
        }, (errorResponse) => {
            this.setProperties({
                loading: false,
                firstLoad: false,
                numberOfResults: 0,
                results: []
            });
            if (errorResponse.status === 400) {
                // If issue with search query, for example, invalid lucene search syntax
                this.set('queryError', true);
            } else {
                // SHARE is Down
                this.set('shareDown', true);
            }
        });
    },
    loadProvider() {
        /**
         *  For PREPRINTS and REGISTRIES
         *  Loads preprint provider if theme.isProvider
         *  Needed because theme's provider was not loading before SHARE was queried.
         */
        if (this.get('theme.isProvider')) {
            this.get('theme.provider').then(provider => {
                this.set('providerName', provider.get('name'));
                this.loadPage();
            });
        }
    },
    scrollToResults() {
        // Scrolls to top of search results
        Ember.$('html, body').scrollTop(Ember.$('.results-top').position().top);
    },
    search() {
        if (!this.get('firstLoad')) {
            this.set('page', 1);
        }
        this.set('loading', true);
        this.get('results').clear();
        Ember.run.debounce(() => {
            this.get('debouncedLoadPage')();
        }, 500);
    },
    transformTypes(obj) {
        // Ember-SHARE method
        if (typeof (obj) !== 'object') {
            return obj;
        }

        for (let key in obj) {
            let lowKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
            obj[lowKey] = this.transformTypes(obj[key]);
            if (key !== lowKey) {
                delete obj[key];
            }
        }
        return obj;
    },
    actions: {
        addFilter(type, filterValue) {
            // Ember-SHARE action. Used to add filter from the search results.
            let currentValue = getSplitParams(this.get(type)) || [];
            let newValue = getUniqueList([filterValue].concat(currentValue));
            this.set(type, encodeParams(newValue));
        },
        clearFilters() {
            // Clears facetFilters for SHARE-type facets
            this.set('facetFilters', Ember.Object.create());
            for (var param in filterQueryParams) {
                let key = filterQueryParams[param];
                if (filterQueryParams.indexOf(key) > -1) {
                    this.set(key, '');
                }
            }
            this.set('start', '');
            this.set('end', '');
            this.set('sort', '');
            this.search();
            // For PREPRINTS and REGISTRIES. Clears activeFilters.
            let restoreActiveFilters = {};
            Object.keys(this.get('activeFilters')).forEach(filter => {
                if (filter === 'providers') {
                    restoreActiveFilters[filter] = this.get('theme.isProvider') ? this.get('activeFilters.providers') : [];
                } else {
                    restoreActiveFilters[filter] = [];
                }

            });
            this.set('activeFilters', restoreActiveFilters);
        },
        filtersChanged() {
            // Ember SHARE action. Fired in faceted-search component when Ember-SHARE facets are modified.
            this.search();
        },
        loadPage(newPage, scroll = true) {
            if (newPage === this.get('page') || newPage < 1 || newPage > this.get('totalPages')) {
                return;
            }
            this.set('page', newPage);
            if (scroll) {
                this.scrollToResults();
            }
            this.loadPage();
        },
        modifyRegistrationType(filter, query) {
            // For REGISTRIES only - modifies "type" query param if "provider" query param changes.
            // Registries are unusual, since the OSF Registration Type facet depends upon the Providers facet
            if (filter === 'provider' && this.get('consumingService') === 'registries') {
                if (query.length === 1 && query[0] === 'OSF') {
                    this.set('type', this.get('activeFilters.types').join('OR'));
                } else {
                    this.set('type', '');
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
            this.search();
        },
        selectSortOption(option) {
            // Runs when sort option changed in dropdown
            this.set('sort', option);
            this.search();
        },
        setLoadPage(pageNumber) {
            // Adapted from PREPRINTS for pagination. When paginating, sets page and scrolls to top of results.
            this.set('page', pageNumber);
            if (scroll) {
                this.scrollToResults();
            }
            this.loadPage();
        },
        toggleShowLuceneHelp() {
            // Toggles display of Lucene Search help modal
            this.toggleProperty('showLuceneHelp');
        },
        typing(val, event) {
            /**
             * Fires on keyup in search bar.
             *
             * Ignores all keycodes that don't result in the value changing
             * 8 == Backspace, 32 == Space
             */
            if (event.keyCode < 49 && !(event.keyCode === 8 || event.keyCode === 32)) {
                return;
            }
            this.search();
        },
        updateFilters(filterType, item) {
            // For PREPRINTS and REGISTRIES.  Modifies activeFilters.
            item = typeof item === 'object' ? item.text : item;
            const filters = Ember.$.extend(true, [], this.get(`activeFilters.${filterType}`));
            const hasItem = filters.includes(item);
            const action = hasItem ? 'remove' : 'push';
            filters[`${action}Object`](item);
            this.set(`activeFilters.${filterType}`, filters);
            this.send('updateQueryParams', filterType, filters);
            this.notifyPropertyChange('activeFilters');
        },
        updateParams(key, value) {
            // Ember SHARE action. Updates query params in URL.
            if (key === 'date') {
                this.set('start', value.start);
                this.set('end', value.end);
            } else {
                value = value ? encodeParams(value) : '';
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
    }
});
