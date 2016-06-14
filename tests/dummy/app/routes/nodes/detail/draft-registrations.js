import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let node = this.modelFor('nodes.detail');
        let drafts = node.get('draftRegistrations');
        return Ember.RSVP.hash({
            node: node,
            drafts: drafts
        });
    },
});
