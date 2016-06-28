import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let node = this.modelFor('nodes.detail');
        let drafts = node.get('draftRegistrations');
        return drafts;
    },
    setupController(controller, model) {
        this._super(controller, model);
        var metaschemas = this.store.findAll('metaschema');
        controller.set('metaschemas', metaschemas);
        controller.set('node', this.modelFor('nodes.detail'));
    }

});
