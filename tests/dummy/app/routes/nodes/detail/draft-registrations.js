import Ember from 'ember';
import permissions from 'ember-osf/const/permissions';

export default Ember.Route.extend({
    model() {
        let node = this.modelFor('nodes.detail');
        let drafts = node.get('draftRegistrations');
        return drafts;
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('node', this.modelFor('nodes.detail'));
    },
    actions: {
        createDraft(schemaId) {
            var _this = this;
            var node = _this.controller.node;
            if (node.get('currentUserPermissions').indexOf(permissions.ADMIN) !== -1) {
                var draft = _this.store.createRecord('draft-registration', {
                    registrationSupplement: schemaId
                });
                node.get('draftRegistrations').pushObject(draft);
                node.save();
            } else {
                console.log('You must have admin permission to create a draft.');
            }
        },
        deleteDraft(draft) {
            var node = this.controller.node;
            if (node.get('currentUserPermissions').indexOf(permissions.ADMIN) !== -1) {
                draft.destroyRecord();
            } else {
                console.log('You do not have permissions to delete this draft');
            }

        }
    }
});
