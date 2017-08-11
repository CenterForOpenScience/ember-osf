import Ember from 'ember';
import layout from './template';
import Analytics from '../../mixins/analytics';
import hostAppName from '../../mixins/host-app-name';
import providerRegex from 'ember-osf/const/providerRegex';
import moment from 'moment';

/**
 * Adapted from Ember-SHARE and Ember Preprints
 * Used for search results on discover page.
 *
 * ```handlebars
 * {{search-result
 *      detailRoute=detailRoute
 *      addFilter='addFilter'
 *      result=result
 *      queryParams=queryParams
 *      filterReplace=filterReplace
 *      updateFilters=(action 'updateFilters')
 * }}
 * ```
 * @class search-result
 */
export default Ember.Component.extend(Analytics, hostAppName, {
    layout,
    maxTags: 10,
    maxSubjects: 10,
    maxCreators: 10,
    maxDescription: 300,
    showBody: false,
    i18n: Ember.inject.service(),
    store: Ember.inject.service(),
    /**
     * Array of query params being used in consuming app
     * @property {Array} queryParams
     */
    queryParams: null,
    /**
     * Search result from SHARE
     * @property {Object} result
     */
    result: null,
    providerUrlRegex: providerRegex,
    /**
     * Name of detail route for consuming application, if you want search result to link to a route in the consuming spp
     * @property {String} detailRoute
     */
     detailRoute: null,
    /**
     * Provider loaded from theme service. Passed in from consuming application.
    * @property {Object} themeProvider
    */
    themeProvider: null,
    filteredProviders: null,
    footerIcon: Ember.computed('showBody', function() {
        return this.get('showBody') ? 'caret-up' : 'caret-down';
    }),
    type: Ember.computed('result.type', function() {
        return this.get('result.type').replace(/\w\S*/g, function(str) {return str.capitalize();});
    }),
    abbreviated: Ember.computed('result.description', function() {
        return this.get('result.description').length > this.get('maxDescription');
    }),
    abbreviation: Ember.computed('result.description', function() {
        let desc = this.get('result.description');
        if (desc) {
            return this.get('result.description').slice(0, this.get('maxDescription'));
        }
    }),
    allCreators: Ember.computed('result.lists.contributors', function() {
        return (this.get('result.lists.contributors') || []).filter(contrib => contrib.relation === 'creator').sort(function(a, b) {
            return a.order_cited - b.order_cited;
        });
    }),
    extraCreators: Ember.computed('allCreators', function() {
        return this.get('allCreators').slice(this.get('maxCreators'));
    }),
    creators: Ember.computed('allCreators', function() {
        return this.get('allCreators').slice(0, this.get('maxCreators'));
    }),
    extraTags: Ember.computed('result.tags', function() {
        return (this.get('result.tags') || []).slice(this.get('maxTags'));
    }),
    identifiers: Ember.computed('result.identifiers', function() {
        return this.get('result.identifiers');
    }),
    tags: Ember.computed('result.tags', function() {
        return (this.get('result.tags') || []).slice(0, this.get('maxTags'));
    }),
    subjects: Ember.computed('result.subjects', 'result.subject_synonyms', 'themeProvider', function() {
        let subs = this.get('themeProvider.id') === 'osf' && this.get('result.subject_synonyms').length ? this.get('result.subject_synonyms') : this.get('result.subjects');
        let uniqueSubs = {}
        subs.map(e => {
            let tax, subjects;
            [tax, ...subjects] = e.text.split('|');
            if (subjects.length) { //accounting for non-custom taxonomy subjects, if we ever get back to that
                for (var i = 0; i < subjects.length; i++) {
                    uniqueSubs[subjects[i]] = {
                        text: subjects[i],
                        value: [tax, ...subjects.slice(0, i+1)].join('|'),
                        taxonomy: tax
                    }
                }
            } else {
                uniqueSubs[e.text] = {
                    text: e.text,
                    value: e.text,
                    taxonomy: null
                };
            }
        });
        uniqueSubs = Object.keys(uniqueSubs).map(e => uniqueSubs[e]);
        return (uniqueSubs || []).slice(0, this.get('maxSubjects'));
    }),
    extraSubjects: Ember.computed('result.subjects', function() {
        return (this.get('result.subjects') || []).slice(this.get('maxSubjects'));
    }),
    retractionId: Ember.computed('result.lists.retractions[]', function() {
        const retractions = this.get('result.lists.retractions');
        if (retractions && retractions.length) {
            return retractions[0].id;
        }
        return null;
    }),
    osfID: Ember.computed('result', function() {
        let re = /osf.io\/(\w+)\/$/;
        // NOTE / TODO : This will have to be removed later. Currently the only "true" preprints are solely from the OSF
        // socarxiv and the like sometimes get picked up by as part of OSF, which is technically true. This will prevent
        // broken links to things that aren't really preprints.
        if (this.get('result.providers.length') === 1 && this.get('result.providers').find(provider => provider.name === 'OSF'))
            for (let i = 0; i < this.get('result.identifiers.length'); i++)
                if (re.test(this.get('result.identifiers')[i]))
                    return re.exec(this.get('result.identifiers')[i])[1];
        return false;
    }),
    hyperlink: Ember.computed('result', function() {
        let urlRegex = /(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)(?:\/)/;
        let re, url, returnedUrl = null;
        const list = this.get('filteredProviders');
        const identifiers = this.get('result.identifiers').filter(ident => ident.startsWith('http://') || ident.startsWith('https://') );
        for (let x = 0; x < identifiers.length; x++) {
            url = identifiers[x].match(urlRegex);
            if (list.includes(url[0]))
                returnedUrl = identifiers[x];
        }
        if (!returnedUrl) {
            for (let i = 0; i < this.get('result.providers.length'); i++) {
                //If the result has multiple providers, and one of them matches, use the first one found.
                re = this.providerUrlRegex[this.get('result.providers')[i].name];
                if (re) break;
            }
            re = re || this.providerUrlRegex.OSF;
            for (let j = 0; j < identifiers.length; j++)
                if (re.test(identifiers[j]))
                    return identifiers[j];
            returnedUrl = identifiers[0];
        }
        return returnedUrl;
    }),
    // Determines whether tags in search results should be links - preprints and registries are not using tag filter right now.
    // NEW: Preprint providers with additionalProviders are using tags, however.
    tagsInQueryParams: Ember.computed('queryParams', 'themeProvider', function() {
        return (this.get('queryParams') || []).includes('tags') && (this.get('themeProvider.additionalProviders') || []).length;
    }),
    dateUpdated: Ember.computed('result.date_updated', function() {
        return moment(this.get('result.date_updated')).utc().format('YYYY-MM-DD');
    }),
    didRender() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.$()[0]]);  // jshint ignore: line
    },
    compare(first, second, param) {
        if (first[param] < second[param]) {
            return -1;
        } else if (first[param] > second[param]) {
            return 1;
        } else {
            return 0;
        }
    },
    actions: {
        addFilter(type, filter) {
            this.sendAction('addFilter', type, filter);
        },
        toggleShowBody() {
            this.toggleProperty('showBody');
            Ember.get(this, 'metrics')
                .trackEvent({
                    category: 'result',
                    action: !this.showBody ? 'contract' : 'expand',
                    label: `Discover - ${this.result.title}`,
                    extra: this.result.id
                });
        },
        select(item) {
            this.attrs.select(item);
        }

    }
});
