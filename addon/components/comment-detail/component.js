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
        },
        restoreComment(comment) {
            this.sendAction('restoreComment', comment);
        },
        reportComment(comment) {
            this.sendAction('reportComment', comment);
        }
    }
});
