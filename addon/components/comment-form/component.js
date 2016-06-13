import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,

    // The comment target object (node, file, or comment)
    target: null,

    _commentText: null,

    actions: {
        addComment(target, text) {
            // TODO: Putting data saving in a component slightly violates DDAU, but I couldn't find a very clean
            //  way to communicate success/failure state of an action back to the component

            // Adds a comment by pushing relationship onto the model for the page
            // This *WILL* fail if the route's model hook does not contain a comments relationship; consider use case
            // TODO simplify
            var commentsRel = target.get('comments');

            // FIXME: This will work for projects and replies to comments, but it will not work for files (which don't provide OSF guid fields)
            var comment = this.store.createRecord('comment', {
                content: text,
                targetID: target.id,
                targetType: Ember.Inflector.inflector.pluralize(target.constructor.modelName)
            });
            commentsRel.pushObject(comment);
            // TODO: Communicate failure state in UI
            target.save().then(() => this.set('_commentText', ''));
        }
    }
});
