import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    newTag: null,
    tags: [],
    actions: {
        addATag(tag) {
            let res = this.attrs.addATag(tag);
            res.then(() => this.set('newTag', ''));
        },
        removeATag(tag) {
            this.sendAction('removeATag', tag);
        }
    }
});
