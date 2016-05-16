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
            }
            node.save()
          // debugger;
          // var relationship = self.store.createRecord('relationship', {
          //   target_type: 'nodes',
          //   target_id: node.id,
          //   data_: [{type: 'institutions', id: inst_id}]
          //
          // })
          // relationship.save()


          // self.store.findRecord('institution', inst_id).then(
          //   function(inst){
          //     var node = self.modelFor(self.routeName);
          //     // var node = self.modelFor(self.routeName);
          //     // var inst = self.store.getRecord('institution', inst_id)
          //     // insts = node.get('affiliatedInstitutions').members.list
          //     // insts.push(inst._internalModel)
          //     // node.set('affiliatedInstitutions', insts)
          //     node.get('affiliatedInstitutions').pushObject(inst)
          //     //node.set('title', 'poo')
          //
          //     node.save()
          //   }
          //)

        //}
    }

});
