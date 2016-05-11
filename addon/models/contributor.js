import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    bibliographic: DS.attr('boolean'),
    permission: DS.attr('string'),
    user: DS.belongsTo('user')
});
