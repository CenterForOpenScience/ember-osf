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
            comment.destroyRecord().then(()=> {
                let relation = this.get('model.comments');
                console.log('calling reload');
                return relation.reload();
            }).then(()=> console.log('done reloading'));
        }
    }
});
