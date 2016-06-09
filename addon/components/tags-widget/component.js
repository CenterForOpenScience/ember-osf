import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    tags: [],
    actions: {
        addATag(tag) {
            this.attrs.addATag(tag);
        },
        removeATag(tag) {
            this.attrs.removeATag(tag);
        }
    }
});
