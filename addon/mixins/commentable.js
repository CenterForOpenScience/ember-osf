/*
  Support basic commenting functionality for routes. Uses the base model in the route model hook.
 */
import Ember from 'ember';

export default Ember.Mixin.create({

    /**
     * The list of comments associated with a model. Defaults to using the model hook and ensures that new comments
     * are shown first (to match API convention)
     *
     * @public
     * @property
     */
    comments: Ember.computed.sort('model.comments', function(a, b) {
        // As new records are added, they do not necessarily respect the newest-first ordering used by the API. Enforce.
        // FIXME: Until the API returns, newly added comments may not have creation date set, in which case sorting fails. Assume anything without a date is new.
        let aTime = a.get('dateCreated') || new Date();
        let bTime = b.get('dateCreated') || new Date();
        return bTime - aTime;
    }),

    actions: {
        addComment(text) {
            // Assumes that the page's model hook is the target for the comment
            let model = this.get('model');
            var commentsRel = model.get('comments');

            var comment = this.store.createRecord('comment', {
                content: text,
                targetID: model.get('guid') || model.id,
                targetType: Ember.Inflector.inflector.pluralize(model.constructor.modelName)
            });
            commentsRel.pushObject(comment);
            return model.save();
        },
        editComment(comment) {
            comment.save();
        },
        deleteComment(comment) {
            comment.set('deleted', true);
            return comment.save();
        },
        restoreComment(comment) {
            comment.set('deleted', false);
            comment.save();
        },
        reportComment() {
            // TODO: Implement
            console.log('Consider this comment reported');
        }
    }
});
