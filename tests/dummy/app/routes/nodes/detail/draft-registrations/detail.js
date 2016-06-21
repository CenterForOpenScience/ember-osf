import Ember from 'ember';
import permissions from 'ember-osf/const/permissions';

export default Ember.Route.extend({
    model(params) {
        let draft = this.store.peekRecord('draft-registration', params.draft_registration_id);
        return draft;
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('node', this.modelFor('nodes.detail'));
    },
    actions: {
        editDraft(updatedMetadata, resourceType) {
            var draft = this.modelFor(this.routeName);
            var node = this.controller.node;
            if (node.get('currentUserPermissions').indexOf(permissions.ADMIN) !== -1) {
                var registrationMetadata = {};
                var schema = draft.get('registrationSchema').get('schema');
                for (var page = 0; page < schema.pages.length; page++) {
                    for (var q = 0; q < schema.pages[page].questions.length; q++) {
                        var question = schema.pages[page].questions[q];
                        if (question.qid in updatedMetadata) {
                            registrationMetadata[question.qid] = updatedMetadata[question.qid];
                        } else {
                            if (draft.get('registrationMetadata')[question.qid]) {
                                var currentValue = draft.get('registrationMetadata')[question.qid].value;
                                if (!(currentValue === '' || typeof (currentValue) === 'object' && currentValue.length === 0)) {
                                    registrationMetadata[question.qid] = draft.get('registrationMetadata')[question.qid];
                                }
                            }
                        }
                    }
                }
                draft.set('registrationMetadata', registrationMetadata);
                draft.save();
                draft.one('didUpdate', this, function() {
                    if (resourceType === 'draft') {
                        this.transitionTo('nodes.detail.draft_registrations');
                    }
                });
            } else {
                console.log('You must have admin permissions to update this draft.');
            }
        },
        registerDraft(updatedMetadata, registrationChoice, liftEmbargo) {
            var node = this.controller.node;
            var draft = this.modelFor(this.routeName);
            if (node.get('currentUserPermissions').indexOf(permissions.ADMIN) !== -1) {
                // Need to update metdata one last time
                if (Object.keys(updatedMetadata).length !== 0) {
                    this.send('editDraft', updatedMetadata, 'registration');
                }
                var registrationPayload = {
                    draftRegistration: draft.id,
                    registrationChoice: registrationChoice
                };
                if (registrationChoice === 'embargo') {
                    registrationPayload.liftEmbargo = liftEmbargo;
                }
                var registration = this.store.createRecord('registration', registrationPayload);
                node.get('registrations').pushObject(registration);
                node.save();
                node.one('didUpdate', this, function() {
                    this.transitionTo('nodes.detail.registrations');
                });
            } else {
                console.log('You must have admin permissions to register this node.');
            }
        }
    }
});
