import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    _commentText: null,

    actions: {
        addComment(text) {
            // Call the passed-in closure action. Reset form only after save succeeds.
            let res = this.attrs.addComment(text);
            res.then(() => this.set('_commentText', ''));
        }
    }
});
