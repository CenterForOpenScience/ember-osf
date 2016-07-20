import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Controller mixin that implements basic commenting functionality. Uses the base model in the route model hook.
 * @class CommentableMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({

    /**
     * The list of comments associated with a model. Defaults to using the model hook, and ensures that new comments
     * are shown first (to match API convention)
     *
     * @public
     * @property comments
     * @type Comment[]
     */
    comments: Ember.computed.sort('model.comments', function(a, b) {
        // As new records are added, they do not necessarily respect the newest-first ordering used by the API. Enforce.
        // FIXME: Until the API returns, newly added comments may not have creation date set, in which case sorting fails. Assume anything without a date is new.
        let aTime = a.get('dateCreated') || new Date();
        let bTime = b.get('dateCreated') || new Date();
        return bTime - aTime;
    }),

    actions: {
        /**
         * Action that adds a new comment targeting the model by GUID.
         * @method addComment
         * @param {String} text The text of the new comment
         * @return {Promise}
         */
        addComment(text, parent) {
            let target = parent || this.get('model');
            var commentsRel = target.get('comments') || target.get('replies');

            var comment = this.store.createRecord('comment', {
                content: text,
                targetID: target.get('guid') || target.id,
                targetType: Ember.Inflector.inflector.pluralize(target.constructor.modelName)
            });
            commentsRel.pushObject(comment);
            return target.save();
        },
        /**
         * Action that edits an existing comment.
         * @method editComment
         * @param {String} text The text of the comment to save
         * @param {DS.Model} comment A comment model
         * @return {Promise}
         */
        editComment(text, comment) {
            comment.set('content', text);
            return comment.save();
        },
        /**
         * Action that handles deletion of an existing comment.
         * @method deleteComment
         * @param comment
         * @return {Promise}
         */
        deleteComment(comment) {
            comment.set('deleted', true);
            return comment.save();
        },
        /**
         * Action that restores a deleted comment.
         * @method restoreComment
         * @param comment
         * @return {Promise}
         */
        restoreComment(comment) {
            comment.set('deleted', false);
            return comment.save();
        },
        /**
         * Action that reports a comment for administrative review
         * @method reportComment
         * @return {Promise}
         */
        reportComment() {
            // TODO: Implement
            console.log('Consider this comment reported');
        }
    }
});
