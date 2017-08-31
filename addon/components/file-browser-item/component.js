import Ember from 'ember';
import moment from 'moment'
import layout from './template';
import pathJoin from 'ember-osf/utils/path-join';
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
    _flashTiming: Ember.observer('item.flash.message', function() {
        setTimeout(() => {
            let item = this.get('item');
            if (item) {
                item.set('flash', null);
            }
        }, this.get('item.flash.time') || 2000);
    }),
    size: Ember.computed('item.size', function() {
        return this.get('item.size') ? humanFileSize(this.get('item.size'), true) : '';
    }),
    date: Ember.computed('item.dateModified', function() {
        let date = this.get('item.dateModified');
        return moment(date).utc().format('YYYY-MM-DD, h:mm:ss a')
    }),
    versionLink: Ember.computed('item.currentVersion', function() {
        return this.get('item.path') + '?revision=' + this.get('item.currentVersion');
    }),
    guid: null,
    link: Ember.computed('item', 'guid', function() {
        let guid = this.get('item.guid') || this.get('guid');
        return guid ? pathJoin(window.location.origin, guid) : undefined;
    }),
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
        },
        copyLink() {
            // this.send('dismissPops');
            if (this.get('link')) {
                return;
            }
            let url = this.get('item.links.info') + '?create_guid=1'
            Ember.$.get(url, resp => {
                this.set('guid', resp.data.attributes.guid);
            })
        },
        dismissPops() {
            Ember.$('.popover').remove();
        }
    }
});
