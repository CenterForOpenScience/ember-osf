import DS from 'ember-data';

/**
 * @module ember-osf
 * @submodule transforms
 */

/**
  Custom field transform that abstracts away bad API behavior. In certain cases the server will insert HTML escape
   sequences into text. This allows them to be correctly and transparently used in templates without manually fixing
   these characters for display on each use.

   This transform is used when `fixstring` is passed as the type parameter to the DS.attr function.
   It replaces `&amp;` with `&`.
    ```app/models/score.js
     import DS from 'ember-data';
     export default DS.Model.extend({
        astring: DS.attr('fixstring'),
     });
   ```
  @class fixstring
  @extends DS.Transform
 */
export default DS.Transform.extend({
    deserialize(serialized) {
        return serialized ? serialized.replace(/&amp;/g, '&') : serialized;
    },

    serialize(deserialized) {
        return deserialized;
    }
});
