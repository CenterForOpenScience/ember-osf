import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Route.extend({
    model(params) {
        let node = this.modelFor('nodes.detail');
        this.store.adapterFor('draft-registration').set('namespace', config.OSF.apiNamespace + '/nodes/' + node.id);
        var draft = this.store.findRecord('draft-registration', params.draft_registration_id);
        return draft;
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('node', this.modelFor('nodes.detail'));
    }
});
