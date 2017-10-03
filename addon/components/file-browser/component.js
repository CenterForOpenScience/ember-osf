import Ember from 'ember';
import layout from './template';

import loadAll from 'ember-osf/utils/load-relationship';
import { authenticatedAJAX } from 'ember-osf/utils/ajax-helpers';

/**
 * File browser widget
 *
 * Sample usage:
 * ```handlebars
 * {{file-browser}}
 * ```
 * @class file-browser
 */
export default Ember.Component.extend({
    // TODO: Improve documentation in the future
    layout,
    //Can be overwritten to have a trimmed down display, these are all the options available to be displayed
    display: Ember.A(['header', 'share-link-column', 'size-column', 'version-column', 'downloads-column', 'modified-column', 'delete-button', 'rename-button', 'download-button', 'view-button', 'info-button', 'upload-button']),
    store: Ember.inject.service(),
    toast: Ember.inject.service(),
    classNames: ['file-browser'],
    dropzoneOptions: {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        maxFiles: 1,
        parallelUploads: 1,
        uploadMultiple: false,
        preventMultipleFiles: true
    },
    init() {
        this.set('_items', Ember.A());
        Ember.$('body').on('click', (e) => {
            if (Ember.$(e.target).parents('.popover.in').length === 0 && Ember.$(e.target).attr('class') && Ember.$(e.target).attr('class').indexOf('popover-toggler') === -1) {
                this.send('dismissOtherPops');
            }
        });
        this._super(...arguments);
    },
    currentUser: Ember.inject.service(),
    edit: Ember.computed('user', function() {
        return this.get('user.id') === this.get('currentUser.currentUserId');
    }),
    _loadFiles(user) {
        //pagination? when?
        loadAll(user, 'quickfiles', this.get('_items')).then(() => this.set('loaded', true));
    },
    _loadUser:  Ember.on('init', Ember.observer('user', function() {
        let user = this.get('user');
        if (!user || this.get('loaded')) {
            return;
        }
        //items need to be reloaded when attrs are received
        let _load = user_ => {
            Ember.run(() => {
                this.set('_items', Ember.A());
                Ember.run.next(() => {
                    this._loadFiles(user_);
                });
            });
        };
        if (user.then) {
            user.then(user_ => {
                _load(user_);
            })
        } else {
            _load(user);
        }
    })),
    uploadUrl: Ember.computed('user', function() {
        return this.get('user.links.relationships.quickfiles.links.upload.href');
    }),
    downloadUrl: Ember.computed('user', function() {
        return this.get('user.links.relationships.quickfiles.links.download.href');
    }),
    loaded: false,
    filtering: false,
    renaming: false,
    uploading: Ember.A(),
    filter: null,
    modalOpen: false,
    itemsLoaded: true,
    selectedItems: Ember.computed.filterBy('items', 'isSelected', true),
    loadedChanged: Ember.observer('itemsLoaded', function() {
        let containerWidth = this.$().width();
        this.set('itemWidth', containerWidth);
    }),
    _flashStatus: Ember.Object.create(),
    flashStatus: Ember.computed('_flashStatus', {
        get(_, key) {
            return this.get(`_flashStatus.${key}`) || {};
        },
        set(_, key, message, type, time) {
            this.set(`_flashStatus.${key}`, {
                message,
                type
            });
            Ember.run.later(() => this.set('_flashStatus.${key}', {
                message: null,
                type: null
            }), time);
        }
    }),
    flash(item, message, type, time) {
        this.set('flashStatus', item.get('id'), message, type || 'success', time || 2000);
    },
    items: Ember.computed('_items', 'textValue', 'filtering', function() {
        //look at ways to use the api to filter
        return this.get('textValue') && this.get('filtering') ? this.get('_items').filter(i => i.get('name').toLowerCase().indexOf(this.get('textValue').toLowerCase()) !== -1) : this.get('_items');
    }),
    textFieldOpen: Ember.computed('filtering', 'renaming', function() {
        return this.get('filtering') ? 'filtering' : (this.get('renaming') ? 'renaming' : false);
    }),
    nameColumnWidth: Ember.computed('display', function() {
        let display = this.get('display');
        let width = 6 + !display.includes('share-link-column') + !display.includes('size-column') + !display.includes('version-column') + !display.includes('downloads-column') + 2 * !display.includes('modified-column');
        if (!display.includes('header')) { //Allows scrollable elements to use extra space occupied by header
            let height = Ember.$('.file-browser-list').height();
            Ember.$('.file-browser-list').height(height + 50);
        }
        return width;
    }),
    browserState: Ember.computed('loaded', '_items', function() {
        return this.get('loaded') ? (this.get('_items').length ? (this.get('items').length ? 'show' : 'filtered') : 'empty') : 'loading';
    }),
    actions: {
        //dropzone listeners
        addedFile(_, __, file) {
            this.get('uploading').pushObject(file);
        },
        uploadProgress(_, __, file, progress) {
            Ember.$('#uploading-' + file.size).css('width', progress + '%');
        },
        dragStart(_, __, e) {
            this.set('dropping', true);
        },
        dragEnd(_, __, e) {
            this.set('dropping', false);
        },
        error(_, __, file, response) {
            this.get('uploading').removeObject(file);
            this.get('toast').error(response);
        },
        success(_, __, file, response) {
            this.get('uploading').removeObject(file);
            let data = response.data.attributes;
            //OPTIONS (some not researched)
            //Ember store method for passing updated attributes (either with a query for the object, or iterating to find matching)
            //Manually updating the object based on new attrs
            //Making an additional request anytime success is done, finding the file detail page based on path
            let path = data.path; //THERE SHOULD BE A BETTER WAY OF DOING THIS
            let conflictingItem = false;
            for (let file of this.get('_items')) {
                if (path === file.get('path')) {
                    conflictingItem = file;
                    break;
                }
            }
            if (conflictingItem) {
                conflictingItem.setProperties({
                    size: data.size,
                    currentVersion: data.extra.version,
                    dateModified: data.modified_utc
                })
                return;
            }
            response.data.type = 'file'; //
            response.data.attributes.currentVersion = '1';
            let item = this.get('store').push(response);
            item.set('links', response.data.links); //Push doesnt pass it links
            this.get('_items').unshiftObject(item);
            this.notifyPropertyChange('_items');
            Ember.run.next(() => this.flash(item, 'This file has been added.'));
        },
        buildUrl(files) {
            let name = files[0].name;
            let conflictingItem = false;
            for (let file of this.get('_items')) {
                if (name === file.get('itemName')) {
                    conflictingItem = file;
                    break;
                }
            }
            if (conflictingItem) {
                return conflictingItem.get('links.upload') + '?kind=file';
            }
            return this.get('uploadUrl') + '?' + Ember.$.param({
                name: files[0].name
            });
        },
        selectItem(item) {
            this.set('renaming', false);
            if (this.get('selectedItems.length') > 1) {
                for (var item_ of this.get('selectedItems')) {
                    item_.set('isSelected', item_ === item);
                }
            } else if (this.get('selectedItems.length') ===  1) {
                if (item.get('isSelected')) {
                    item.set('isSelected', false);
                    return;
                }
                let otherItem = this.get('selectedItems.firstObject');
                otherItem.set('isSelected', false);
            }
            item.set('isSelected', true);
            this.set('shiftAnchor', item);
        },
        selectMultiple(item, toggle) {
            this.set('renaming', false);
            if (toggle) {
                item.toggleProperty('isSelected');
            } else {
                let items = this.get('items');
                let anchor = this.get('shiftAnchor');
                if (anchor) {
                    let max = Math.max(items.indexOf(anchor), items.indexOf(item));
                    let min = Math.min(items.indexOf(anchor), items.indexOf(item));
                    for (var item_ of this.get('items')) {
                        item_.set('isSelected', item_ === item || item_ === anchor || (items.indexOf(item_) > min && items.indexOf(item_) < max));
                    }
                }
                item.set('isSelected', true);
            }
            Ember.run.next(this, function(){
                if (this.get('selectedItems.length') === 1) {
                    this.set('shiftAnchor', item)
                }
            });
        },
        viewItem() {
            let item = this.get('selectedItems.firstObject');
            this.sendAction('openFile', item);
        },
        openItem(item, qparams) {
            this.sendAction('openFile', item, qparams);
        },
        downloadItem() {
            let downloadLink = this.get('selectedItems.firstObject.links.download');
            window.location = downloadLink;
        },
        _deleteItem(item, url) {
            authenticatedAJAX({
                url: url,
                type: 'DELETE',
                xhrFields: {withCredentials: true}
            })
            .done(() => {
                this.flash(item, 'This file has been deleted.', 'danger');
                Ember.run.later(() => {
                    this.get('_items').removeObject(item);
                    this.notifyPropertyChange('_items');
                }, 1800);
            })
            .fail(() => this.flash(item, 'Delete failed.', 'danger'));
        },
        deleteItem(){
            let item = this.get('selectedItems.firstObject');
            let url = item.get('links.download');
            this.send('_deleteItem', item, url);
            this.set('modalOpen', false);
        },
        deleteItems() {
            for (let item_ of this.get('selectedItems')) {
                let url = item_.get('links.download');
                this.send('_deleteItem', item_, url);
            }
            this.set('modalOpen', false);
        },
        _rename(conflict) {
            let item = this.get('selectedItems.firstObject');
            this.set('modalOpen', false);
            authenticatedAJAX({
                url: item.get('links.upload'),
                type: 'POST',
                xhrFields: {withCredentials: true},
                headers: {
                    'Content-Type': 'Application/json'
                },
                data: JSON.stringify({
                    action: 'rename',
                    rename: this.get('textValue'),
                    conflict: conflict || 'replace'
                })
            })
            .done(response => {
                item.set('itemName', response.data.attributes.name);
                this.flash(item, 'Successfully renamed');
                if (conflict === 'replace') {
                    const replacedItem  = this.get('_conflictingItem');
                    if (!replacedItem) {
                        return;
                    }
                    this.flash(replacedItem, 'This file has been replaced', 'danger');
                    setTimeout(() => {
                        this.get('_items').removeObject(replacedItem);
                        this.notifyPropertyChange('_items');
                    }, 1800);
                }
            })
            .fail(() => this.flash(item, 'Failed to rename item', 'danger'));
            this.set('textValue', null);
            this.toggleProperty('renaming');
        },
        rename() {
            let rename = this.get('textValue');
            let conflict = false;
            for (let item of this.get('_items')) {
                if (item.get('itemName') === rename) {
                    if (item === this.get('selectedItems.firstObject')) {
                        this.set('textValue', null);
                        this.toggleProperty('renaming');
                        return;
                    }
                    conflict = true;
                    this.set('_conflictingItem', item);
                    break;
                }
            }
            if (conflict) {
                this.set('modalOpen', 'renameConflict');
            } else {
                this.send('_rename');
            }
        },
        cancelRename() {
            this.set('textValue', null);
            this.toggleProperty('renaming')
            this.set('modalOpen', false);
        },
        sort(by, order) {
            let sorted = this.get('_items').sortBy(by);
            this.set('_items', order === 'asc' ? sorted : sorted.reverse());
        },
        toggleText(which) {
            this.set('textValue', which === 'renaming' ? this.get('selectedItems.firstObject.itemName') : null);
            this.toggleProperty(which);
        },
        openModal(modalType) {
            this.set('modalOpen', modalType);
        },
        closeModal() {
            this.set('modalOpen', false);
        },
        textValueKeypress() {
            if (this.get('renaming')) {
                this.send('rename');
            }
        },
        dismissOtherPops(item) {
            for (var item_ of this.get('items')) {
                if (!item || item_.get('path') !== item.get('path')) {
                    item_.set('visiblePopup', false);
                }
            }
        }
    }
});
