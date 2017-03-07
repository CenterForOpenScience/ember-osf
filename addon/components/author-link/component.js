import Ember from 'ember';
import layout from './template';


/**
 * @module ember-osf
 * @submodule components
 */

/**
 *
 * Creates a link to contributor name if link exists, otherwise just displays contributor name
 *
 * Sample usage:
 * ```handlebars
 * {{author-link
 *      contributor=contributor
 *}}
 * ```
 * @class author-link
 */
export default Ember.Component.extend({
    layout,
    tagName: 'span',
    contributor: null,

    profileLink: Ember.computed('contributor', function() {
        // Changed from contributor.users.identifiers
        let ids = this.get('contributor.identifiers');

        for (let i = 0; i < ids.length; i++)
            if (ids[i].match(/^https?:\/\/(?:.*\.)osf\.io/))
                    return ids[i];

        return false;
    })
});
