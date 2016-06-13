import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
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
            let link = this.modelFor(this.routeName).get('links.download');
            if (typeof versionID != 'undefined') {
                versionID = encodeURIComponent(versionID);
                link = `${link}?version=${versionID}`;
            }
            window.open(link);
        }
    }
});
