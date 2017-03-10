import Ember from 'ember';
import layout from './template';

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
export default Ember.Component.extend({
    layout,
    maxTags: 5,
    maxSubjects: 5,
    maxCreators: 10,
    maxDescription: 300,
    showBody: false,
    queryParams: null,
    providerUrlRegex: {
        //'bioRxiv': '', doesnt currently have urls
        Cogprints: /cogprints/,
        OSF: /https?:\/\/((?!api).)*osf.io/, // Doesn't match api.osf urls
        PeerJ: /peerj/,
        arXiv: /arxivj/,
        'ClinicalTrials.gov': /http:\/\/clinicaltrials.gov/,
    },
    detailRoute: null, // Add name of route you want search-result to if route exists in consuming app
    footerIcon: Ember.computed('showBody', function() {
        return this.get('showBody') ? 'caret-up' : 'caret-down';
    }),

    type: Ember.computed('result.type', function() {
        return this.get('result.type').replace(/\w\S*/g, function(str) {return str.capitalize();});
    }),
    safeTitle: Ember.computed('result.title', function() {
        return Ember.String.htmlSafe(this.get('result.title')).string;
    }),
    safeDescription: Ember.computed('result.description', function() {
        return Ember.String.htmlSafe(this.get('result.description')).string;
    }),
    abbreviated: Ember.computed('safeDescription', function() {
        return this.get('safeDescription').length > this.get('maxDescription');
    }),
    abbreviation: Ember.computed('safeDescription', function() {
        return this.get('safeDescription').slice(0, this.get('maxDescription'));
    }),
    allCreators: Ember.computed('result.lists.contributors', function() {
        return (this.get('result.lists.contributors') || []).filterBy('relation', 'creator').sortBy('order_cited');
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
    subjects: Ember.computed('result.subjects', function() {
        return (this.get('result.subjects') || []).slice(0, this.get('maxSubjects'));
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
        let re = null;
        for (let i = 0; i < this.get('result.providers.length'); i++) {
            //If the result has multiple providers, and one of them matches, use the first one found.
            re = this.providerUrlRegex[this.get('result.providers')[i].name];
            if (re) break;
        }

        re = re || this.providerUrlRegex.OSF;

        const identifiers = this.get('result.identifiers').filter(ident => ident.startsWith('http://'));

        for (let j = 0; j < identifiers.length; j++)
            if (re.test(identifiers[j]))
                return identifiers[j];

        return identifiers[0];
    }),
    // Determines whether tags in search results should be links - preprints and registries are not using tag filter right now
    tagsInQueryParams: Ember.computed('queryParams', function() {
        let foundTags = false;
        this.get('queryParams').forEach(param => {
            if (param === 'tags') {
                foundTags = true;
            }
        });
        return foundTags;
    }),
    didRender() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.$()[0]]);  // jshint ignore: line
    },
    actions: {
        addFilter(type, filter) {
            this.sendAction('addFilter', type, filter);
        },
        toggleShowBody() {
            this.set('showBody', !this.showBody);
        },
        select(item) {
            this.attrs.select(item);
        }

    }
});
