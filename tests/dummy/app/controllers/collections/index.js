import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        createCollection: function(title) {
            if (title) {
                var collection = this.store.createRecord('collection', {
                    title: title
                });
                collection.save();
            }
            else {
                console.log('Title required.');
            }

        }
    }
});
