import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    givenName: DS.attr('string'),
    middleNames: DS.attr(),
    familyName: DS.attr('string'),
    fullName: DS.attr('string'),

    nodes: DS.hasMany('nodes')
});
