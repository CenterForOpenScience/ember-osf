import DS from 'ember-data';

import OsfModel from './osf-model';
import FileItemMixin from 'ember-osf/mixins/file-item';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 files. This model may be used with one of several API endpoints. It may be queried directly,
 *  or (more commonly) accessed via relationship fields.
 * This model is used for basic file metadata. To interact with file contents directly, see the `file-manager` service.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/File_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Files_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_File_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Files_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_File_Detail_GET
 * @class File
 */
export default OsfModel.extend(FileItemMixin, {
    _isFileModel: true,

    name: DS.attr('string'),
    kind: DS.attr('string'),
    guid: DS.attr('string'),
    path: DS.attr('string'),
    size: DS.attr('number'),
    currentVersion: DS.attr('number'),
    provider: DS.attr('string'),
    materializedPath: DS.attr('string'),
    lastTouched: DS.attr('date'),
    dateModified: DS.attr('date'),
    dateCreated: DS.attr('date'),
    extra: DS.attr(),
    tags: DS.attr(),

    parentFolder: DS.belongsTo('file', { inverse: 'files' }),

    // Folder attributes
    files: DS.hasMany('file', { inverse: 'parentFolder' }),

    // File attributes
    versions: DS.hasMany('file-version'),
    comments: DS.hasMany('comment'),
    node: DS.belongsTo('node'),  // TODO: In the future apiv2 may also need to support this pointing at nodes OR registrations
    checkout: DS.attr('string')
});
