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
    permission: DS.attr('fixstring'),

    _userId: null,
    userId: Ember.computed('_userId', {
        get: function() {
            if (this.get('isNew')) {
                return this.get('_userId');
            } else {
                return this.get('id').split('-').pop();
            }
        },
        set: function(_, userId) {
            this.set('_userId', userId);
        }
    }).volatile(),
    _nodeId: null,
    nodeId: Ember.computed('_nodeId', {
        get: function() {
            if (this.get('isNew')) {
                return this.get('_nodeId');
            } else {
                return this.get('id').split('-').shift();
            }
        },
        set: function(_, nodeId) {
            this.set('_nodeId', nodeId);
        }
    }).volatile(),

    users: DS.belongsTo('user'),
    unregisteredContributor: DS.attr('fixstring'),
    index: DS.attr('number'),
    fullName: DS.attr('fixstring'),
    email: DS.attr('fixstring'),
    sendEmail: DS.attr('boolean'),

    node: DS.belongsTo('node', {
        inverse: 'contributors'
    }),
    preprint: DS.belongsTo('preprint', {
        inverse: 'contributors'
    })
});
