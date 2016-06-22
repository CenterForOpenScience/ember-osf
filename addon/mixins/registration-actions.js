
import Ember from 'ember';

export default Ember.Mixin.create({
    node: null,
    draft: null,
    model: null,
    _node: Ember.computed.or('node'),
    _draft: Ember.computed.or('draft', 'model'),

    _generateRegistrationMetadata(draft, updatedMetadata) {
        var registrationMetadata = {};
        var schema = draft.get('registrationSchema').get('schema');
        var draftMetadata = draft.get('registrationMetadata');

        for (var page = 0; page < schema.pages.length; page++) {
            for (var q = 0; q < schema.pages[page].questions.length; q++) {
                var question = schema.pages[page].questions[q];
                if (question.qid in updatedMetadata) {
                    registrationMetadata[question.qid] = updatedMetadata[question.qid];
                } else {
                    if (draftMetadata[question.qid]) {
                        var currentValue = draftMetadata[question.qid].value;
                        if (!(currentValue === '' || typeof (currentValue) === 'object' && currentValue.length === 0)) {
                            registrationMetadata[question.qid] = draftMetadata[question.qid];
                        }
                    }
                }
            }
        }
        return registrationMetadata;
    },

    _generateRegistrationPayload(draft, registrationChoice, liftEmbargo) {
        var registrationPayload = {
            draftRegistration: draft.id,
            registrationChoice: registrationChoice
        };
        if (registrationChoice === 'embargo') {
            registrationPayload.liftEmbargo = liftEmbargo;
        }
        return registrationPayload;
    },

    actions: {
        createDraft(schemaId) {
            var node = this.get('_node');
            var draft = this.store.createRecord('draft-registration', {
                registrationSupplement: schemaId
            });
            node.get('draftRegistrations').pushObject(draft);
            return node.save();
        },
        deleteDraft(draft) {
            return draft.destroyRecord();
        },
        editDraft(updatedMetadata) {
            var draft = this.get('_draft');
            var updatedRegistrationMetadata = this._generateRegistrationMetadata(draft, updatedMetadata);
            draft.set('registrationMetadata', updatedRegistrationMetadata);
            return draft.save();
        },
        registerDraft(updatedMetadata, registrationChoice, liftEmbargo) {
            var node = this.get('_node');
            var draft = this.get('_draft');
            // May need to update metdata one last time
            if (Object.keys(updatedMetadata).length !== 0) {
                this.send('editDraft', updatedMetadata, 'registration');
            }
            var registrationPayload = this._generateRegistrationPayload(draft, registrationChoice, liftEmbargo);
            var registration = this.store.createRecord('registration', registrationPayload);
            node.get('registrations').pushObject(registration);
            return node.save();
        }
    }
});
