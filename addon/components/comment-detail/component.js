import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,

    actions: {
        editedComment(comment, content) {
            comment.set('content', content);
            comment.save();
        }
    }
});
