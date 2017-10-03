import Ember from 'ember';
import moment from 'moment'
import layout from './template';
import pathJoin from 'ember-osf/utils/path-join';
import humanFileSize from 'ember-osf/utils/human-file-size';
/**
 * @module ember-osf
 * @submodule components
 */
 /**
  * Display one row of item, with its information.
  *
  * Sample usage:
  * ```handlebars
  *     {{file-browser-item
  *        item=item
  *        selectItem=(action 'selectItem') - Action handling clicking on the body of the row
  *        openItem=(action 'openItem') - Action handling clicking the link-name of the file
  *        selectMultiple=(action 'selectMultiple') Action - handling clicking multiple rows, through cmd/ctrl and/or shift
  *        display=display Array[Strings] - Indicating which rows of information to display
  *        nameColumnWidth=nameColumnWidth String of number - How wide is the main collumn (name)
  *        dismissOtherPops=(action 'dismissOtherPops') Action - handling cleaning up popups created by the Share button
  *     }}
  * ```
  * @class file-browser-icon
  */

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
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
        openVersion() {
            this.sendAction('openItem', this.get('item'), '?revision=' + this.get('item.currentVersion'));
        },
        open() {
            this.sendAction('openItem', this.get('item'));
        },
        copyLink() {
            this.sendAction('dismissOtherPops', this.get('item'));
            this.set('item.visiblePopup', true);
            if (this.get('link')) {
                return;
            }
            let url = '';
            if (this.get('item.links.info')) {
                url = this.get('item.links.info') + '?create_guid=1';
            } else {
                let adapter = this.get('store').adapterFor('file');
                url = adapter.buildURL('files', this.get('item.path').slice(1)) + '?create_guid=1';
            }
            Ember.$.get(url, resp => {
                this.set('guid', resp.data.attributes.guid);
            })
        },
        dismissPop() {
            this.set('item.visiblePopup', false);
        }
    }
});
