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
        console.log('observer actually getting hit');
        setTimeout(() => {
            let item = this.get('item');
            if (item) {
                item.set('flash', null);
            }
        }, 2000);
        //setTimeout
        //set flash to null
    }),
    size: Ember.computed('item.size', function() {
        return humanFileSize(this.get('item.size'), true);
    }),
    date: Ember.computed('item.dateModified', function() {
        let date = this.get('item.dateModified');
        return moment(date).utc().format('YYYY-MM-DD, h:mm:ss a')
    }),
    link: Ember.computed('item.path', function() {
        let link = this.get('item.path');
        return pathJoin(window.location.origin, link);
    }),
    versionLink: Ember.computed('item.currentVersion', function() {
        return this.get('item.path') + '?revision=' + this.get('item.currentVersion');
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
        }
    }
});
