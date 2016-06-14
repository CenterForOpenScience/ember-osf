import Ember from 'ember';
import layout from './template';

/* use:
 * {{file-browser rootNode=node selectedFile=file
 *   onClickFile=(action) onClickNode=(action)}}
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-browser'],

    selectedPath: Ember.computed('selectedFile', function() {
        // TODO: return array of node/provider/folder names leading from root to
        // selected file. not sure how best to deal with child components, since
        // we don't know for sure which node the file belongs to without fetching
        // most of the file tree (it could belong to a child component of the
        // root node)
        //
        //let pathArray = this.get('selectedFile.materializedPath').split('/');
    })
});
