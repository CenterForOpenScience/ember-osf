import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * File-like models are `node`, `file-provider`, and `file`/folder.
 * This mixin provides a polymorphic interface for file-like items, and is intended to be used with models.
 *
 * @class FileItemMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    itemName: Ember.computed.or('name', 'title'),
    isNode: Ember.computed.equal('constructor.modelName', 'node'),
    isProvider: Ember.computed.equal('constructor.modelName', 'file-provider'),
    isFolder: Ember.computed.and('_isFileModel', '_isFolder'),
    isFile: Ember.computed.and('_isFileModel', '_isFile'),
    canHaveChildren: Ember.computed.or('isNode', 'isProvider', 'isFolder'),

    _isFileModel: Ember.computed.equal('constructor.modelName', 'file'),
    _isFolder: Ember.computed.equal('kind', 'folder'),
    _isFile: Ember.computed.equal('kind', 'file')
});
