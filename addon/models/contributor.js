import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    bibliographic: DS.attr('boolean'),
    permission: DS.attr('string'),
    users: DS.hasMany('user'),
    nodeId: DS.attr('string')
});
