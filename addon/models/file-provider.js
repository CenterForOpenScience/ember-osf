import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    name: DS.attr('string'),
    kind: DS.attr('string'),
    path: DS.attr('string'),
    files: DS.hasMany('file'), // TODO only files/folders in root
    node: DS.belongsTo('node')
});
