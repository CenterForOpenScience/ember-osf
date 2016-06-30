import Ember from 'ember';
import DS from 'ember-data';

import GuidReferent from './guid-referent';

/**
 * Model for OSF APIv2 files. This model may be used with one of several API endpoints. It may be queried directly,
 *  or (more commonly) accessed via relationship fields.
 * This model is used for basic file metadata. To interact with file contents directly, see the `file-manager` service.
 * For field and usage information, see:
 *    https://api.osf.io/v2/docs/#!/v2/File_Detail_GET
 *    https://api.osf.io/v2/docs/#!/v2/Node_Files_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/Node_File_Detail_GET
 *    https://api.osf.io/v2/docs/#!/v2/Registration_Files_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/Registration_File_Detail_GET
 */
export default GuidReferent.extend({
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
    isFile: Ember.computed.equal('kind', 'file'),
    isProvider: false,

    // Folder attributes
    files: DS.hasMany('file', { inverse: 'parentFolder' }),

    // File attributes
    versions: DS.hasMany('file-version'),
    comments: DS.hasMany('comment'),
    checkout: DS.attr('string')
});
