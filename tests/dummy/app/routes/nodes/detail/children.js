import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let node = this.modelFor('nodes.detail');
        return node.get('children');
    },
});
