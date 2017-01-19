import Ember from 'ember';
import layout from './template';

// Copied from Ember-SHARE - some pieces added from Ember-preprints as well.
export default Ember.Component.extend({
    layout,
    maxTags: 5,
    maxContributors: 6,
    maxDescription: 350,
    showBody: false,
    footerIcon: Ember.computed('showBody', function() {
        return this.get('showBody') ? 'caret-up' : 'caret-down';
    }),

    type: Ember.computed('obj.type', function() {
        return this.get('obj.type').capitalize();
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
    extraContributors: Ember.computed('obj.lists.contributors', function() {
        return (this.get('obj.lists.contributors') || []).slice(this.get('maxContributors'));
    }),
    contributors: Ember.computed('obj.lists.contributors', function() {
        return (this.get('obj.lists.contributors') || []).slice(0, this.get('maxContributors'));
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
