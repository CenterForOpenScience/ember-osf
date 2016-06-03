import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return this.store.findRecord('collection', params.collection_id);
    },
    actions: {
        addNodeToCollection(projectId) {
            this.store.findRecord('node', projectId).then(node => {
                var collection = this.modelFor(this.routeName);
                collection.get('linkedNodes').pushObject(node);
                collection.save();
            });
        },
    }
});
