import Ember from 'ember';
import PaginatedControllerMixin from  'ember-osf/mixins/paginated-controller';

export default Ember.Controller.extend(PaginatedControllerMixin, {
    actions: {
        /**
        * Create a node
        *
        * @method createNode
        * @param {String} title, Node title
        * @param {String} description Node description
        * @return {Promise} Returns a promise that resolves to the created node
        */
        createNode: function(title, description) {
            var node = this.store.createRecord('node', {
                title: title,
                category: 'project',
                description: description || null
            });
            node.save();
        }
    }
});
