import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 contributors. Primarily accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Contributors_List_GET
 * @class Contributor
 */
export default OsfModel.extend({
    bibliographic: DS.attr('boolean'),
    permission: DS.attr('string'),
    userId: Ember.computed('id', function() {
        return this.get('id').split('-').pop();
    }),
    nodeId: Ember.computed('id', function() {
        return this.get('id').split('-').shift();
    }),
    users: DS.belongsTo('user'),
    unregisteredContributor: DS.attr('string'),
    index: DS.attr('number'),

    node: DS.belongsTo('node', {
	inverse: 'contributors'
    })
});
