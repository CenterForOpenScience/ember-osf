import Ember from 'ember';

export default Ember.Controller.extend({
    currentUser: Ember.inject.service(),
    init() {
        this.get('currentUser').load().then(user => this.set('user', user));
    },
    actions: {
        fileDetail(file) {
            this.transitionToRoute('nodes.detail.files.provider.file',
                                   this.get('node'),
                                   file.get('provider'),
                                   file);
        },

        nodeDetail(node) {
            this.transitionToRoute('nodes.detail', node);
        }
    }
});
