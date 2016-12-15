import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return this.store.findRecord('collection', params.collection_id);
    },
    actions: {
        /**
        * Add node to a collection
        *
        * @method addNodeToCollection
        * @param {String} projectId, ID of node (linkedNode) to be added to the collection
        * @return {Promise} Returns a promise that resolves to the updated collection
        * with the new linkedNodes relationship
        */
        addNodeToCollection(projectId) {
            this.store.findRecord('node', projectId).then(node => {
                var collection = this.modelFor(this.routeName);
                collection.get('linkedNodes').pushObject(node);
                return collection.save();
            });
        },
        /**
        * Remove node from a collection
        *
        * @method removeNodeFromCollection
        * @param {Object} project Node(linkedNode) relationship to be removed from collection
        * @return {Promise} Returns a promise that resolves to the updated collection
        * with the linkedNode relationship removed.  The node itself is not removed.
        */
        removeNodeFromCollection(project) {
            var collection = this.modelFor(this.routeName);
            collection.get('linkedNodes').removeObject(project);
            return collection.save();
        },
        /**
        * Add registration to a collection
        *
        * @method addRegistrationToCollection
        * @param {String} registrationId, ID of registration (linkedRegistration) to be added to the collection
        * @return {Promise} Returns a promise that resolves to the updated collection
        * with the new linkedRegistration relationship
        */
        addRegistrationToCollection(registrationId) {
            this.store.findRecord('registration', registrationId).then(registration => {
                var collection = this.modelFor(this.routeName);
                collection.get('linkedRegistrations').pushObject(registration);
                return collection.save();
            });
        },
        /**
        * Remove registration from a collection
        *
        * @method removeRegistrationFromCollection
        * @param {Object} registration linkedRegistration to be removed from collection
        * @return {Promise} Returns a promise that resolves to the updated collection
        * with the linkedRegistration relationship removed.  The registration itself is not deleted.
        */
        removeRegistrationFromCollection(registration) {
            var collection = this.modelFor(this.routeName);
            collection.get('linkedRegistrations').removeObject(registration);
            return collection.save();
        },
    }
});
