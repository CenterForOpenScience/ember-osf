import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        var node = this.modelFor('nodes/detail');
        return node.get('files');
    },
});
