import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let node = this.modelFor('nodes.detail');
        let drafts = node.get('draftRegistrations');
        return drafts;
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('node', this.modelFor('nodes.detail'));
    }

});
