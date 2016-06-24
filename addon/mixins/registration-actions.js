
import Ember from 'ember';

export default Ember.Mixin.create({
    node: null,
    draft: null,
    model: null,
    _draft: Ember.computed.or('draft', 'model'),
    /** Updates current registration metadata with new responses to questions.
     **/
    _updateMetadata(currentMetadata, newMetadata) {
        var map = new Map(Object.entries(newMetadata));
        for (let items of map.entries()) {
            var key = items[0];
            var value = items [1];
            if (typeof (value) === 'object') {
                var newValue = this._updateMetadata(currentMetadata[key] || {}, value);
                currentMetadata[key] = newValue;
            } else {
                currentMetadata[key] = newMetadata[key];
            }
        }
        return currentMetadata;
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
            var node = this.get('node');
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
            var metadataClone = JSON.parse(JSON.stringify(draft.get('registrationMetadata')));
            var updatedRegistrationMetadata = this._updateMetadata(metadataClone, updatedMetadata);
            draft.set('registrationMetadata', updatedRegistrationMetadata);
            return draft.save();
        },
        registerDraft(updatedMetadata, registrationChoice, liftEmbargo) {
            var node = this.get('node');
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
