import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createCollection: function(title) {
      var collection = this.store.createRecord('collection',{
        title: title,
      });
      collection.save();
    }
  }
});
