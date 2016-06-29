import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let file = this.modelFor('nodes.detail.files.provider.file');
        return file.get('versions');
    },
});
