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
        let file = this.get('selectedFile');
        if (!file) {
            return null;
        }
        let pathArray = this.get('selectedFile.materializedPath').split('/');
        pathArray = pathArray.filter((name) => name !== '');
        pathArray.unshift(file.get('provider'));
        pathArray.unshift(this.get('rootNode.title'));
        return Ember.A(pathArray);
    })
});
