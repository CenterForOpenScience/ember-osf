import DS from 'ember-data';
import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    date: DS.attr('date'),
    action: DS.attr('string'),
    params: DS.attr(),
    node: DS.belongsTo('node', {
        inverse: null
    }),
    originalNode: DS.belongsTo('node', {
        inverse: 'logs'
    }),
    user: DS.belongsTo('user'),
    linked_node: DS.belongsTo('node'),
    templateNode: DS.belongsTo('node', {
        inverse: 'templateFrom'
    })
});
