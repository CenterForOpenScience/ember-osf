import Ember from 'ember';

export default Ember.Controller.extend({
    _url: null,
    openModal: false,
    resolve: null,
    latestFileName: null,
    dropzoneOptions: {
        method: 'PUT'
    },
    actions: {
        preUpload(comp, drop, file) {
            this.set('openModal', true);
            this.set('latestFileName', file.name);
            var promise =  new Ember.RSVP.Promise(resolve => {
                this.set('resolve', resolve);
            });
            return promise;
        },
        closeModal() {
            this.set('_url', 'http://localhost:7777/file?path=/' + this.get('latestFileName') + '&nid=' + this.get('nodeId')+ '&provider=osfstorage')
            this.set('openModal', false);
            this.get('resolve')();
        },
        createNode: function(title, description) {
            var node = this.store.createRecord('node', {
                title: title,
                category: 'project',
                description: description || null
            });
            node.save();
        },
        buildUrl () {
            return this.get('_url');
        }
    }
});
