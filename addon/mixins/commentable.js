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
         * @param {Comment|File|Node|Wiki} parent The target of this comment
         * @return {Promise} The newly created comment
         */
        addComment(text, parent) {
            // FIXME: Known issue: if you add a comment, then delete without refreshing, you get a 409 error. This is because the target fields are still there in the store and haven't been cleared of placeholder values.
            // Solution will involve only serializing those if adapterOptions indicates we're saving a new (not updated) comment

            // TODO: Rework signature so parent/ target argument is always required in all usages
            let target = parent || this.get('model');

            let targetID = target.get('guid') || target.id;
            let targetType = Ember.Inflector.inflector.pluralize(target.constructor.modelName);

            var comment = this.store.createRecord('comment', {
                content: text,
                targetID: targetID,
                targetType: targetType
            });
            // TODO: Check whether store gets updated with information about the new comment associated with the target
            //   (in various cases it probably won't, eg due to unclear inverse relationship for preprint-through-nodes)
            return comment.save({
                adapterOptions: {
                    operation: 'create',
                    targetID: targetID,
                    targetType: targetType,
                }
            });
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
