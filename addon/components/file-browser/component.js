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
      // TODO: return array of node/provider/folder names leading to the
      // selected file. not sure how to deal with child components, since we
      // don't know for sure which node the file belongs to (could be a child
      // component of the root node)
      //
      //let path = this.get('selectedFile.materializedPath');
  })
});
