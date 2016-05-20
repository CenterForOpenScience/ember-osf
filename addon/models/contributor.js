import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    bibliographic: DS.attr('boolean'),
    permission: DS.attr('string'),
    users: DS.hasMany('user'),
    nodeId: DS.attr('string')
});
