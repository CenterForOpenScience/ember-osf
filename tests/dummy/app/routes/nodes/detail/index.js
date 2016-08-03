import Ember from 'ember';
import loadAll from 'ember-osf/utils/load-relationship';

export default Ember.Route.extend({
    currentUser: Ember.inject.service(),
    model() {
        return this.modelFor('nodes.detail');
    },

    setupController(controller, model) {
        this.get('currentUser').load()
            .then((user) => controller.set('user', user))
            .catch(() => controller.set('user', null));
        controller.set('user', this.modelFor('application'));

        let dest = Ember.A();
        loadAll(model, 'contributors', dest).then(()=>
            controller.set('contributors', dest));
        return this._super(...arguments);
    }
});
