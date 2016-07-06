import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Controller mixin that implements common actions performed on registrations (and registration drafts).
 * @class RegistrationActionsMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    /**
     * TODO: Document this parameter
     * @property node
     * @type DS.Model
     */
    node: null,
    /**
     * The draft to perform these actions on. If not specified, defaults to the model hook.
     * @property draft
     * @type DS.Model
     */
    draft: null,
    model: null,
    _draft: Ember.computed.or('draft', 'model'),
    /**
     * Update the current registration metadata with new responses. Takes the
     * currentMetadata and recursively merges in the newMetadata.
     *
     * @method _updateMetadata
     * @param {Object} currentMetadata The registration metadata at last save.
     * @param {Object} newMetadata New registration metadata.
     * @return {Object} Returns merge of currentMetadata and newMetadata
     */
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
    /**
     * Build the request payload used when creating a registration from a draft.
     *
     * @method _generateRegistrationPayload
     * @private
     * @param {String} draft ID of the draft registration
     * @param {String} registrationChoice Either "immediate" or "embargo".
     * @param {Date} liftEmbargo if registrationChoice === "embargo", liftEmbargo should be the date to lift the embargo.
     * @return {Object} Returns the attributes portion of the payload for creating a registration.
     */
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
        /**
         * Create a draft registration of the node.
         *
         * @method createDraft
         * @param {String} schemaId ID of the chosen registration schema
         * @return {Promise} Returns a promise that resolves to the updated node - with the
         * newly created draft registration.
         */
        createDraft(schemaId) {
            var node = this.get('node');
            var draft = this.store.createRecord('draft-registration', {
                registrationSupplement: schemaId
            });
            node.get('draftRegistrations').pushObject(draft);
            return node.save();
        },
        /**
         * Delete a draft registration of the node.
         *
         * @method deleteDraft
         * @param {Object} draft Draft to be deleted
         * @return {Promise} Returns a promise that resolves after the deletion of the draft.
         */
        deleteDraft(draft) {
            return draft.destroyRecord();
        },
        /**
         * Edit a draft registration of the node
         *
         * @method editDraft
         * @param {Object} updatedMetadata Responses to questions in the registration
         * schema, nested in the format the registration schema expects
         * to questions in the registration schema
         * @return {Promise} Returns a promise that resolves to the updated draft
         */
        editDraft(updatedMetadata) {
            var draft = this.get('_draft');
            var metadataClone = JSON.parse(JSON.stringify(draft.get('registrationMetadata')));
            var updatedRegistrationMetadata = this._updateMetadata(metadataClone, updatedMetadata);
            draft.set('registrationMetadata', updatedRegistrationMetadata);
            return draft.save();
        },
        /**
         * Register a draft (creates a registration from a draft)
         *
         * @method registerDraft
         * @param {Object} updatedMetadata esponses to questions in the registration
         * schema, nested in the format the registration schema expects
         * @param {String} registrationChoice Either "immediate" or "embargo".
         * @param {Date} liftEmbargo if registrationChoice === "embargo", liftEmbargo should be the date to lift the embargo.
         * @return {Promise} Returns a promise that resolves to the updated node with the newly created registration relationship
         */
        registerDraft(updatedMetadata, registrationChoice, liftEmbargo) {
            var node = this.get('node');
            var draft = this.get('_draft');
            // Update metadata one last time if changes have been made since last save.
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
