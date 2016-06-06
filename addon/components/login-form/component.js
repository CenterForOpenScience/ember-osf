import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    // Where to POST the form data
    submitUrl: null
});
