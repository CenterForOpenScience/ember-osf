/*
  Support basic commenting functionality for routes. Uses the base model in the route model hook.
 */
import Ember from 'ember';

export default Ember.Mixin.create({

    comments: Ember.A(),

    reloadComments: Ember.observer('model', function() {
        // Uses hasManyQuery to fetch comments whenever model is updated. This will allow us to support pagination of
        //   comments relationships in the future.
        let model = this.get('model');
        model.query('comments').then((res) => this.set('comments', res));
    }),

    actions: {
        addComment(text) {// TODO: Add a guid and handle file comments

            // Assumes that the page's model hook is the target for the comment; we can make generalize if needed
            let model = this.get('model');
            var commentsRel = model.get('comments');

            // FIXME: This will work for projects and replies to comments, but it will not work for files (which don't provide OSF guid fields)
            var comment = this.store.createRecord('comment', {
                content: text,
                targetID: model.get('guid') || model.id,
                targetType: Ember.Inflector.inflector.pluralize(model.constructor.modelName)
            });
            commentsRel.pushObject(comment);

            // FIXME: Known issue: the temp comment ID generated this way results in a brief double-entry in the comment list
            // TODO: We save through the model to get correct URL, but then need to reload the comments data to get correct
            // state (server-generated comment ID and other fields) back for the newly created comment
            //   Is there a more straightforward way?
            return model.save()
                .then(() => commentsRel.reload());
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
