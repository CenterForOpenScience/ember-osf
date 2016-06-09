import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    comment: null,

    actions: {
        editComment(comment) {
            this.sendAction('editComment', comment);
        },
        deleteComment(comment) {
            this.sendAction('deleteComment', comment);

        }
    }
});
