import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        /**
        * Create a collection
        *
        * @method createCollection
        * @param {String} title Title for collection
        * @return {Promise} Returns a promise that resolves to the new collection.
        */
        createCollection: function(title) {
            var collection = this.store.createRecord('collection', {
                title: title
            });
            collection.save();
        }
    }
});
