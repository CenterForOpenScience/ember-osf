import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
    extractAttributes(modelClass, resourceHash) {
        // ApiV2 `links` exist outside the attributes field; make them accessible to the data model
        if (resourceHash.links) {  // TODO: Should also test whether model class defines a links field
            resourceHash.attributes.links = resourceHash.links;
        }
        return this._super(modelClass, resourceHash);
    },

    keyForAttribute(key, method) {
        if (method === 'deserialize') {
            return Ember.String.underscore(key);
        } else if (method === 'serialize') {  // TOOD: Is this needed? Test serialization
            return Ember.String.camelize(key);
        }
    }
    
    
    // TODO: Sending back to server requires
    // 1. Remove links from payload (try something like serializer attrs: field{serialize:false}), and what happens if record has no links field?
    // 2. Rename keys in payload (try setting something with snake case)
    // 3. Veirfy post, put, and patch operations
    // 4. Don't send relationships, if that breaks writing operations
    
});
