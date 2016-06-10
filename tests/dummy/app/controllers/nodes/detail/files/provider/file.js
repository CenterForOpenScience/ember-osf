import Ember from 'ember';

export default Ember.Controller.extend({
    fileManager: Ember.inject.service(),

    actions: {
        fileDetail(file) {
            this.transitionToRoute('nodes.detail.files.provider.file',
                                   this.get('node'),
                                   file.get('provider'),
                                   file);
        },

        nodeDetail(node) {
            this.transitionToRoute('nodes.detail', node);
        },

        delete() {
            let file = this.get('model');
            this.get('fileManager').deleteFile(file).then(() => {
                this.transitionToRoute('nodes.detail.files', this.get('node'));
            }).catch((error) => {
                //TODO display error
            });
        },

        checkout() {
            // TODO
        },

        download() {
            let link = this.get('model.links.download');
            window.open(link);
        },

        revisions() {
            // TODO
        }
    }
});
