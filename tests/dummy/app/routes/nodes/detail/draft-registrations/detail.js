import Ember from 'ember';
import permissions from 'ember-osf/const/permissions';

export default Ember.Route.extend({
    model(params) {
        let node = this.modelFor('nodes.detail');
        let draft = this.store.peekRecord('draft-registration', params.draft_registration_id);
        return Ember.RSVP.hash({
            node: node,
            draft: draft
        });
    },
    actions: {
        editDraft(updatedMetadata, resourceType) {
            var draft = this.modelFor(this.routeName).draft;
            var node = this.modelFor(this.routeName).node;
            if (node.get('currentUserPermissions').indexOf(permissions.ADMIN) !== -1) {
                var registrationMetadata = {};
                var schema = draft.get('registrationSchema').get('schema');
                for (var page = 0; page < schema.pages.length; page++) {
                    for (var q = 0; q < schema.pages[page].questions.length; q++) {
                        var question = schema.pages[page].questions[q];
                        if (question.qid in updatedMetadata) {
                            registrationMetadata[question.qid] = updatedMetadata[question.qid];
                        } else {
                            var currentValue = draft.get('registrationMetadata')[question.qid].value;
                            if (!(currentValue === '' || typeof (currentValue) === 'object' && currentValue.length === 0)) {
                                registrationMetadata[question.qid] = draft.get('registrationMetadata')[question.qid];
                            }
                        }
                    }
                }
                draft.set('registrationMetadata', registrationMetadata);
                draft.save();
                draft.one('didUpdate', this, function() {
                    if (resourceType === 'draft') {
                        this.transitionTo('nodes.detail.registrations');
                    }
                });
            } else {
                console.log('You must have admin permissions to update this draft.');
            }
        },
        registerDraft(updatedMetadata, registrationChoice, liftEmbargo) {
            var node = this.modelFor(this.routeName).node;
            var draft = this.modelFor(this.routeName).draft;
            if (node.get('currentUserPermissions').indexOf(permissions.ADMIN) !== -1) {
                // Need to update metdata one last time
                // this.send('editDraft', updatedMetadata, 'registration')
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
