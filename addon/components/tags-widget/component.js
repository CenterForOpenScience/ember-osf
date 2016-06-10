import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    tags: [],
    actions: {
        addATag(tag) {
            this.sendAction('addATag', tag);
        },
        removeATag(tag) {
            this.sendAction('removeATag', tag);
        }
    }
});
