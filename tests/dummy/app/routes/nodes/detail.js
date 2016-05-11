import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
	    return this.store.findRecord('node', params.node_id);
    },

    setupController(controller, model) {
        controller.set('editedTitle', model.get('title'));
        this._super(...arguments);
    },

    actions: {
        editExisting(value) {
            // TODO: Should test PUT or PATCH
            console.log('Will edit title from', this.modelFor(this.routeName).get('title'), ' to ', value);
            var node = this.modelFor(this.routeName);
            if (node.get('currentUserPermissions').indexOf('write') !== -1) {
                node.set('title', value);
                node.save();
            } else {
                console.log('You do not have permissions to edit this node');
            }
        },
        affiliateNode(inst_id){
          var self = this;
          // var node = self.modelFor(self.routeName);
          // debugger;
          // node.addInstitution(inst_id);
          self.store.findRecord('institution', inst_id).then(
            function(inst){
              var node = self.modelFor(self.routeName);
              node.get('affiliatedInstitutions').pushObject(inst)
              node.set('title', 'poo')
              node.save()
            }
          )

        }
    }

});
