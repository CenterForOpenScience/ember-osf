
import Ember from 'ember';

export default Ember.Mixin.create({
    node: null,
    draft: null,
    model: null,
    _node: Ember.computed.or('node'),
    _draft: Ember.computed.or('draft', 'model'),
    /** Updates current registration metadata with new responses to questions.
     **/
    _updateMetadata(d, u) {
        var map = new Map(Object.entries(u));
        for (let items of map.entries()) {
            var key = items[0];
            var value = items [1];
            if (typeof (value) === 'object') {
                var r = this._updateMetadata(d[key] || {}, value);
                d[key] = r;
            } else {
                d[key] = u[key];
            }
        }
        return d;
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
            var metadataClone = JSON.parse(JSON.stringify(draft.get('registrationMetadata')));
            var updatedRegistrationMetadata = this._updateMetadata(metadataClone, updatedMetadata);
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
