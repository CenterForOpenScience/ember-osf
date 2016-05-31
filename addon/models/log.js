import DS from 'ember-data';

import OsfModel from './osf-model';

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
    linkedNode: DS.belongsTo('node', {
        inverse: null
    }),
    templateNode: DS.belongsTo('node', {
        inverse: null
    })
});
