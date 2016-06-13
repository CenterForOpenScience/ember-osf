import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    name: DS.attr('string'),
    kind: DS.attr('string'),
    path: DS.attr('string'),
    size: DS.attr('number'),
    provider: DS.attr('string'),
    materializedPath: DS.attr('string'),
    lastTouched: DS.attr('date'),
    dateModified: DS.attr('date'),
    dateCreated: DS.attr('date'),
    extra: DS.attr(),
    tags: DS.attr(),

    parentFolder: DS.belongsTo('file', { inverse: 'files' }),
    isFolder: Ember.computed.equal('kind', 'folder'),
    isProvider: false,

    // Folder attributes
    files: DS.hasMany('file', { inverse: 'parentFolder' }),

    // File attributes
    versions: DS.hasMany('file-version'),
    comments: DS.hasMany('comment', {
        updateRequestType: 'POST'
    }),
    checkout: DS.attr()
});
