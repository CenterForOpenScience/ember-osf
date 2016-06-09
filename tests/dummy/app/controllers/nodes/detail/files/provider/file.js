import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        reloadFiles() {
            this.transitionToRoute('nodes.detail.files.provider',
                this.get('node'), this.model.get('provider'));
        },
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
        }
    }
});
