import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    model() {
        return this.get('store').findRecord('user', 'me');
    },

    setupController(controller, model) {
        controller.set('editedFullName', model.get('fullName'));
        this._super(...arguments);
    },

    actions: {
        /**
        * Edit user name
        *
        * @method editExisting
        * @param {String} value User fullName
        * @return {Promise} Returns a promise that resolves to the updated user
        */
        editExisting(value) {
            // TODO: Should test PUT or PATCH
            var user = this.modelFor(this.routeName);
            user.set('fullName', value);
            user.save();
        }
    }
});
