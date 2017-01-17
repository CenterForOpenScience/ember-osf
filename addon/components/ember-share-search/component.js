import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    classNames: ['ember-share-search'],
    layout,
    searchPlaceholder: 'Search...',
    searchButton: 'Search',
    poweredBy: 'powered by'
});
