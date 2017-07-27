import Ember from 'ember';
import layout from './template';

const iconForType = {
    image: ['png', 'jpeg', 'jpg', 'tiff', 'gif', 'bmp'],
    pdf: ['pdf'],
    word: ['doc', 'docx', 'dotx', 'dot', 'docm'],
    code: ['py', 'js', 'css', 'html', 'awk', 'bat', 'c', 'cpp', 'h', 'hdl', 'java', 'jar', 'mk', 'pl', 'sh', 'coffee', 'ipynb', 'lua', 'm', 'php', 'pyc', 'r', 'rb'],
    video: ['mov', 'mkv', 'flv', 'avi', 'mp4'],
    powerpoint: ['ppt', 'pptx', 'pptm', 'potx'],
    audio: ['mp3', 'wav', 'flac', 'aiff', 'wma'],
    excel: ['xlsx', 'xlsm', 'xltx', 'xltm', 'csv'],
    text: ['txt', 'md', 'rtf']
};

const typeToIcon = {};
for (let icon in iconForType) {
    for (let type of iconForType[icon]) {
        typeToIcon[type] = icon;
    }
}
/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the correct file tree icon for on the item to be displayed
 *
 * Sample usage:
 * ```handlebars
 * {{file-browser-icon
 * item=item}}
 * ```
 * @class file-browser-icon
 */
export default Ember.Component.extend({
    layout,
    tagName: 'span',

    iconName: Ember.computed('item', 'item.expanded', function() {
        // TODO: More icons!
        if (this.get('item.isNode')) {
            // TODO node types
            return 'cube';
        }
        if (this.get('item.isProvider')) {
            // TODO provider-specific icons
            return 'hdd-o';
        }
        if (this.get('item.isFolder')) {
            return 'folder';
        }

        let type = this.get('item.itemName');

        type = type ? type.split('.').slice(-1)[0].toLowerCase() : 'NOT_AN_ACTUAL_TYPE';
        let icon = typeToIcon[type];

        return 'file' + (icon ? '-' + icon : '') + '-o';
    })
});
