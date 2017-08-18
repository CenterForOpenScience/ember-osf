import Ember from 'ember';

export default Ember.Controller.extend({
    userId: 'zva8y',
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
