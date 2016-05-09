import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    title: DS.attr('string'),
    affiliated_institutions: DS.hasMany('institutions', {
        inverse: 'registrations'
    }),
});
