import Ember from 'ember';
import layout from './template';

// Adapted from Ember-SHARE
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service()
});
