import Ember from 'ember';
import layout from './template';

/**
 * Adapted from Ember-SHARE - some pieces added from Ember-Preprints as well.
 *
 * ```handlebars
 * {{search-result
 *      detailRoute=detailRoute
 *      addFilter='addFilter'
 *      obj=obj
 * }}
 * ```
 * @class search-result
 */
export default Ember.Component.extend({
    layout,
    maxTags: 5,
    maxSubjects: 5,
    maxCreators: 6,
    maxDescription: 350,
    showBody: false,
    detailRoute: null, //Add name of route you want search-result to link to if not using Ember-SHARE detail page
    footerIcon: Ember.computed('showBody', function() {
        return this.get('showBody') ? 'caret-up' : 'caret-down';
    }),

    type: Ember.computed('obj.type', function() {
        return this.get('obj.type').replace(/\w\S*/g, function(str) {return str.capitalize();});
    }),
    safeTitle: Ember.computed('obj.title', function() {
        return Ember.String.htmlSafe(this.get('obj.title')).string;
    }),
    safeDescription: Ember.computed('obj.description', function() {
        return Ember.String.htmlSafe(this.get('obj.description')).string;
    }),
    abbreviated: Ember.computed('safeDescription', function() {
        return this.get('safeDescription').length > this.get('maxDescription');
    }),
    abbreviation: Ember.computed('safeDescription', function() {
        return this.get('safeDescription').slice(0, this.get('maxDescription'));
    }),
    allCreators: Ember.computed('obj.lists.contributors', function() {
        return (this.get('obj.lists.contributors') || []).filterBy('relation', 'creator').sortBy('order_cited');
    }),
    extraCreators: Ember.computed('allCreators', function() {
        return this.get('allCreators').slice(this.get('maxCreators'));
    }),
    creators: Ember.computed('allCreators', function() {
        return this.get('allCreators').slice(0, this.get('maxCreators'));
    }),
    extraTags: Ember.computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(this.get('maxTags'));
    }),
    identifiers: Ember.computed('obj.identifiers', function() {
        return this.get('obj.identifiers');
    }),
    tags: Ember.computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(0, this.get('maxTags'));
    }),
    subjects: Ember.computed('obj.subjects', function() {
        return (this.get('obj.subjects') || []).slice(0, this.get('maxSubjects'));
    }),
    extraSubjects: Ember.computed('obj.subjects', function() {
        return (this.get('obj.subjects') || []).slice(this.get('maxSubjects'));
    }),
    retractionId: Ember.computed('obj.lists.retractions[]', function() {
        const retractions = this.get('obj.lists.retractions');
        if (retractions && retractions.length) {
            return retractions[0].id;
        }
        return null;
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

    }
});
