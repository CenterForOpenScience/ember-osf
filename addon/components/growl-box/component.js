import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    type: 'danger',
    message: 'You dun goofed'
});
