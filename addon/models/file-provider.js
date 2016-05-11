import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    kind: DS.attr('string'),
    name: DS.attr('string'),
    path: DS.attr('string'),
    //node: DS.belongsTo('node'),
    provider: DS.attr('string'),
    files: DS.hasMany('file'), 

    isFolder: Ember.computed.equal('kind', 'folder'),
});
