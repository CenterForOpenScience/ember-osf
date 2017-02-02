import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import GuidRouteMaskMixin from 'ember-osf/mixins/guid-route-mask';

export default Ember.Route.extend(AuthenticatedRouteMixin, GuidRouteMaskMixin , {
    fileManager: Ember.inject.service(),

    model(params) {
        // TODO: verify this file actually belongs to the parent node?
        return this.store.findRecord('file', params.file_id);
    },

    setupController(controller, model) {
        this._super(controller, model);
        let node = this.modelFor('nodes.detail');
        controller.set('node', node);
    },

    actions: {
        download(versionID) {
            let file = this.modelFor(this.routeName);
            let options = {};
            if (typeof versionID !== 'undefined') {
                options.query = {
                    version: versionID
                };
            }
            let url = this.get('fileManager').getDownloadUrl(file, options);
            window.open(url);
        }
    }
});
