import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    _commentText: null,
    actions: {
        addComment(text) {
            // TODO: Future improvement- only wipe the field if and when comment has been successfully saved
            //  (will require a good way to communicate results back from action on the parent controller)
            this.sendAction('addComment', text);
            this.set('_commentText', '');
        },
    }
});
