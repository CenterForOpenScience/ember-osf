import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    session: Ember.inject.service('session'),
    onSearchPage: false,
    allowLogin: true, // TODO: Make this configurable from... somewhere

});
