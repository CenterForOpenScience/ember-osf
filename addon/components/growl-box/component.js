import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    growler: Ember.inject.service(),
    actions: {
        dismiss(growl) {
            growl.set('dismissed', true);
        }
    }
});
