import Ember from 'ember';

/**
 * A `file-browser` item could be a `node`, `file-provider`, or `file`/folder.
 * This mixin provides a consistent interface for `file-browser` to use.
 */
export default Ember.Mixin.create({
    fileName: Ember.computed.or('name', 'title'),
    childItems: Ember.computed.union('files', 'children'),

    canHaveChildren: Ember.computed.or('isNode', 'isProvider', 'isFolder'),
    isNode: Ember.computed.equal('constructor.modelName', 'node'),
    isProvider: Ember.computed.equal('constructor.modelName', 'file-provider'),
    isFolder: Ember.computed.and('_isFileModel', '_isFolder'),
    isFile: Ember.computed.and('_isFileModel', '_isFile'),

    _isFileModel: Ember.computed.equal('constructor.modelName', 'file'),
    _isFolder: Ember.computed.equal('kind', 'folder'),
    _isFile: Ember.computed.equal('kind', 'file'),
});
