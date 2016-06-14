import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        addComment(text) {
            // Assumes that the page's model hook is the target for the comment; we can make generalize if needed
            let model = this.get('model');
            var commentsRel = model.get('comments');

            // FIXME: This will work for projects and replies to comments, but it will not work for files (which don't provide OSF guid fields)
            var comment = this.store.createRecord('comment', {
                content: text,
                targetID: model.id,
                targetType: Ember.Inflector.inflector.pluralize(model.constructor.modelName)
            });
            commentsRel.pushObject(comment);

            // TODO: We save through the model to get correct URL, but then need to reload the comment to get correct state back for the comment
            //   Is there a more straightforward way?

            // FIXME: Known issue: the temp comment ID generated this way results in a brief double-entry in the comment list (which disappears on refresh)
            return model.save()
                .then(() => commentsRel.reload() );
        },
        editComment(comment) {
            comment.save();
        },
        deleteComment(comment) {
            let relation = this.get('model.comments');
            // TODO: Deleting comment triggers an update event. Wait for that reload to finish before actual reload can occur
            //   Dear me, I hope this can be improved
            // TODO: Delete operation can/will be replaced with patch operation
            comment.destroyRecord()
                .then(() => relation.reload())
                .then(() => relation.reload());
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
