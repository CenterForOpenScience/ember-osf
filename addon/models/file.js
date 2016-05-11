import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    /* FILE model
    name: DS.attr('string'),
    kind: DS.attr('string'),
    size: DS.attr('number'),
    path: DS.attr('string'),
    materializedPath: DS.attr('string'),
    lastTouched: DS.attr('date'),
    dateModified: DS.attr('date'),
    dateCreated: DS.attr('date'),

    provider: DS.belongsTo('file-provider'),
    parentFolder: DS.belongsTo('file'),
    extra: DS.attr(), 

    // Folder attributes
    children: DS.hasMany('file'),

    // File attributes
    versions: DS.hasMany('file-version'),
    comments: DS.hasMany('comment'),
    contents: DS.belongsTo('file-contents')
    */

    // FileProvider model
    name: DS.attr('string'),
    kind: DS.attr('string'),
    path: DS.attr('string'),
    files: DS.hasMany('file'), // TODO only files/folders in root
    node: DS.belongsTo('node')
});
