import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    createNode: function(title, description){
      var node = this.store.createRecord('node', {
        title: title,
        category: 'project',
        description: description || null,
      })
      node.save()
    }
  }
});
