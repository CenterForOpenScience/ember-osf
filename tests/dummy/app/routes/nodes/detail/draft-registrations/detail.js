import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        let node = this.modelFor('nodes.detail');
        this.store.adapterFor('draft-registration').set('namespace', 'v2/nodes/' + node.id);
        var draft = this.store.findRecord('draft-registration', params.draft_registration_id);
        return draft;
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('node', this.modelFor('nodes.detail'));
    }
});
