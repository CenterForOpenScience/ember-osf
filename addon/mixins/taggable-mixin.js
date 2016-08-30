import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Controller mixin that implements basic tagging functionality. Uses the model defined in the model hook.
 * @class TaggableMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    actions: {
        /**
         * Appends a tag to the current array of tags on the resource.  Copies current
         * list of tags, appends new tag to copy, and then sets tags on the resource
         * as the modified copy.
         *
         * @method addATag
         * @param {DS.Model} model A model instance that supports tags functionality
         * @param {String} tag New tag to be added to list.
         */
        addATag(model, tag) {
            var currentTags = model.get('tags').slice(0);
            Ember.A(currentTags);
            currentTags.pushObject(tag);
            model.set('tags', currentTags);
            return model.save();
        },
        /**
         * Removes a tag from the current array of tags on the resource.
         *
         * @method removeATag
         * @param {DS.Model} model A model instance that supports tags functionality
         * @param {String} tag Tag to be removed from list.
         */
        removeATag(model, tag) {
            var currentTags = model.get('tags').slice(0);
            currentTags.splice(currentTags.indexOf(tag), 1);
            model.set('tags', currentTags);
            model.save();
        }
    }
});
