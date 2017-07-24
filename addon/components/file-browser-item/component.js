import Ember from 'ember';
import moment from 'moment'
import layout from './template';
import humanFileSize from 'ember-osf/utils/human-file-size';
/**
 * @module ember-osf
 * @submodule components
 */

export default Ember.Component.extend({
    layout,
    classNames: ['file-browser-item'],

    selected: Ember.computed('selectedItems.[]', function() {
        // TODO: This would be better if selectedItems were a hash. Can Ember
        // observe when properties are added to or removed from an object?
        let selectedItems = this.get('selectedItems');
        let index = selectedItems.indexOf(this.get('item'));
        return index > -1;
    }),
    size: Ember.computed('item.size', function() {
        return humanFileSize(this.get('item.size'), true);
    }),
    date: Ember.computed('item.dateModified', function() {
        let date = this.get('item.dateModified');
        return moment(date).utc().format('YYYY-MM-DD, h:mm:ss a')
    }),
    didReceiveAttrs() {
        if (this.get('display').indexOf('version-column') !== -1) {
            this.get('item.versions').then(versions => {
                //Assumes first item is latest version
                let version = versions.objectAt(0);
                this.set('versionId', version.get('id'));
                this.set('versionLink', version.get('links.html'));
            });
        }
    },
    click(e) {
        if (e.shiftKey || e.metaKey) {
            this.sendAction('selectMultiple', this.get('item'), e.metaKey);
        } else {
            this.sendAction('selectItem', this.get('item'));
        }
    },
    actions: {
        open() {
            this.sendAction('openItem', this.get('item'));
        }
    }
});
