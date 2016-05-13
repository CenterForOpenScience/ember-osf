import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
      return this.store.query('node', { filter: { parent: this.modelFor('nodes.detail').get('id')}});
    }
});
