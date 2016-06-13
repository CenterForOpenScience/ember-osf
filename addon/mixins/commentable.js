import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        editComment(comment) {
            comment.save();
        },
        deleteComment(comment) {
            let relation = this.get('model.comments');
            // TODO: Deleting comment triggers an update event. Wait for that reload to finish before actual reload can occur
            //   Dear me, I hope this can be improved
            comment.destroyRecord()
                .then(() => relation.reload())
                .then(() => relation.reload());
        },
        restoreComment(comment) {
            comment.set('deleted', false);
            comment.save();
        },
        reportComment(comment) {
            // TODO: Implement
            console.log('Consider this comment reported');
        }
    }
});
