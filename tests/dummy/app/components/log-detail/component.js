import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    i18n: Ember.service.inject(),
});
