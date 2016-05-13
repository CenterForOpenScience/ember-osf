import Ember from 'ember';
import DS from 'ember-data';
import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    name: DS.attr('string'),
    kind: DS.attr('string'),
    path: DS.attr('string'),
    size: DS.attr('number'),
    provider: DS.attr('string'),

    materializedPath: DS.attr('string'),
    lastTouched: DS.attr('date'),
    dateModified: DS.attr('date'),
    dateCreated: DS.attr('date'),

    checkout: DS.attr(),
    extra: DS.attr(),

    // Folder attributes
    files: DS.hasMany('file', { inverse: 'parentFolder' }),

    // File attributes
    versions: DS.hasMany('file-version'),
    comments: DS.hasMany('comment'),
    //contents: DS.belongsTo('file-contents'),

    parentFolder: DS.belongsTo('file'),
    isFolder: Ember.computed.equal('kind', 'folder'),
});
