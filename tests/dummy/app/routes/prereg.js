import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    fileManager: Ember.inject.service(),
    actions: {
        preregister(name, files) {
            let store = this.get('store');

            let fileNames = files.mapBy('name').join(', ');

            // TODO: This page is just a file-chooser demo at this point
            alert(`Files: ${fileNames}`);

            // store.createRecord('node', { title: name, ... })
            
            // for (let file of files) {
            //     this.get('fileManager').uploadFile(...)
            // }
        }
    }
});
