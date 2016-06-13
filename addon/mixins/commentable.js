import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        addComment(text) {
            // TODO: Implement
            // Adds a comment by pushing relationship onto the model for the page
            // This *WILL* fail if the route's model hook does not contain a comments relationship; consider use case
            // TODO simplify
            var model = this.get('model');
            var commentsRel = this.get('model.comments');

            // FIXME: This will work for projects and replies to comments, but it will not work for files (which don't provide OSF guid fields)
            var comment = this.store.createRecord('comment', {
                content: text,
                targetID: model.id,
                targetType: Ember.Inflector.inflector.pluralize(model.constructor.modelName)
            });
            commentsRel.pushObject(comment);
            model.save();
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
