import Ember from 'ember';

export default Ember.Route.extend({
    model(routeParams) {
        return this.get('store').findAll('waffleSwitch');
    }
});
