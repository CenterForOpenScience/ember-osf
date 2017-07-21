import Ember from 'ember';
import layout from './template';

import loadAll from 'ember-osf/utils/load-relationship';
import { authenticatedAJAX } from 'ember-osf/utils/ajax-helpers';

/**
 * @module ember-osf
 * @submodule components
 */

/*
 * Wrapper for file items. Includes state for the item's row.
 *
 */
let FileItem = Ember.ObjectProxy.extend({
    isSelected: false,

    // TODO (Abram) update childItems when `children` or `files` changes
    // TODO (Abram) catch and display errors
    childItems: Ember.computed('_files.[]', '_children.[]', function() {
        let files = this._setupLoadAll('files', '_files', '_filesLoaded');
        let children = this._setupLoadAll('children', '_children', '_childrenLoaded');

        let wrappedItems = Ember.A();
        if (files) {
            wrappedItems.addObjects(files.map(wrapItem));
        }
        if (children) {
            wrappedItems.addObjects(children.map(wrapItem));
        }
        return wrappedItems;
    }),
    _files: null,
    _children: null,

    childItemsLoaded: Ember.computed.and('_filesLoaded', '_childrenLoaded'),
    _filesLoaded: false,
    _childrenLoaded: false,

    _setupLoadAll(relationship, destName, loaded) {
        let dest = this.get(destName);
        if (dest === null) {
            let model = this.get('content');
            if (relationship in model) {
                dest = this.set(destName, Ember.A());
                loadAll(model, relationship, dest).then(() => {
                    this.set(loaded, true);
                });
            } else {
                this.set(loaded, true);
            }
        }
        return dest;
    }
});

function wrapItem(item) {
    if (item instanceof FileItem) {
        return item;
    }
    return FileItem.create({
        content: item
    });
}

function unwrapItem(item) {
    if (item instanceof FileItem) {
        return item.get('content');
    }
    return item;
}

/**
 * File browser widget
 *
 * Sample usage:
 * ```handlebars
 * {{file-browser
 *  rootItem=item
 *  openFile=(action 'openFile')
 *  openNode=(action 'openNode')}}
 * ```
 * @class file-browser
 */
export default Ember.Component.extend({
    // TODO: Improve documentation in the future
    layout,
    display: Ember.A(['header', 'share-link-column', 'size-column', 'version-column', 'downloads-column', 'modified-column', 'delete-button', 'rename-button', 'download-button', 'view-button', 'info-button', 'upload-button']), //Can be overwritten to have a trimmed down display, these are all the options available to be displayed
    store: Ember.inject.service(),
    classNames: ['file-browser'],
    dropzoneOptions: {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
    },
    currentUser: Ember.inject.service(),
    uploadUrl: null,
    didReceiveAttrs() {
        this.get('currentUser').load().then(user => {
            //Hopefully this is done by the time user can upload. Alternatives include adding a loading indicator to the upload button or
            //changin dropzone widget code to take promises
            this.set('uploadUrl', user.get('links.relationships.files.links.upload.href'));
            loadAll(user, 'files', this.get('_items'));

        })
    },
    breadcrumbs: null,
    filtering: false,
    renaming: false,
    uploading: Ember.A(),
    rootItem: Ember.computed('breadcrumbs.[]', {
        get() {
            return this.get('breadcrumbs.firstObject');
        },
        set(_, item) {
            let wrappedItem = wrapItem(item);
            this.set('breadcrumbs', Ember.A([wrappedItem]));
        }
    }),
    filter: null,
    modalOpen: false,
    atRoot: Ember.computed.equal('breadcrumbs.length', 1),
    currentParent: Ember.computed.readOnly('breadcrumbs.lastObject'),
    _items: Ember.A(),//Ember.computed.reads('currentParent.childItems.firstObject.childItems'),
    itemsLoaded: true,//Ember.computed.readOnly('currentParent.childItemsLoaded'),
    selectedItems: Ember.computed.filterBy('items', 'isSelected', true),
    loadedChanged: Ember.observer('itemsLoaded', function() {
        let containerWidth = this.$().width();
        this.set('itemWidth', containerWidth);
    }),
    items: Ember.computed('_items', 'textValue', 'filtering', function() {
        //look at ways to use the api to filter
        return this.get('textValue') && this.get('filtering') ? this.get('_items').filter(i => i.get('name').indexOf(this.get('textValue')) !== -1) : this.get('_items');
    }),
    textFieldOpen: Ember.computed('filtering', 'renaming', function() {
        return this.get('filtering') ? 'filtering' : (this.get('renaming') ? 'renaming' : false);
    }),
    nameColumnWidth: Ember.computed('display', function() {
        let display = this.get('display');
        let width = 5 + 2 * !display.includes('share-link-column') + !display.includes('size-column') + !display.includes('version-column') + !display.includes('downloads-column') + 2 * !display.includes('modified-column');
        return width;
    }),
    _error(message) {
        //send message
    },
    //infinite scrolling
    //typeahead of filtering with only a single page load, lazy loading of the pages
    actions: {
        //dropzone listeners
        addedFile(_, __, file) {
            this.get('uploading').pushObject(file);
        },
        uploadProgress(_, __, file, progress) {
            Ember.$('#uploading-' + file.size).css('width', progress + '%');
        },
        dragEnter() {
            this.set('dropping', true);
        },
        dragLeave() {
            //TODO this is not being triggered consistently enough. How fix?
            this.set('dropping', false);
        },
        error(_, __, file, response) {
            debugger;
            this.get('uploading').removeObject(file);
            //send warning on failure
            //TODO failure sucess messaging engine
        },
        success(_, __, file, response) {
            this.get('uploading').removeObject(file);
            response.data.type = 'file'; //

            let item = this.get('store').push(response)
            this.get('_items').pushObject(item);
        },
        buildUrl(files) {
            return this.get('uploadUrl') + '?' + Ember.$.param({
                name: files[0].name
            });
        },
        selectItem(item) {
            if (this.get('selectedItems.length')) {
                for (var item_ of this.get('selectedItems')) {
                    item_.set('isSelected', item_ === item);
                }
            }
            item.set('isSelected', true);
            this.set('shiftAnchor', item);
        },
        selectMultiple(item, toggle) {
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
            this.sendAction('openItem', unwrapItem(item));
        },
        openItem(item) {
            this.sendAction('openFile', unwrapItem(item));
        },
        downloadItem() {
            let downloadLink = this.get('selectedItems.firstObject.links.download');
            window.location = downloadLink;
        },
        deleteItem(){
            let item = this.get('selectedItems.firstObject')
            let url = item.get('links.download');

            authenticatedAJAX({
                url: url,
                type: 'DELETE',
                xhrFields: {withCredentials: true}
            })
            .success(data => {
                this.get('_items').removeObject(item);
            })
            .fail(data => {

            }).then(() => this.set('modalOpen', false));
        },
        deleteItems() {
            for (var item_ of this.get('selectedItems')) {
                let url = item_.get('links.download');
                authenticatedAJAX({
                    url: url,
                    type: 'DELETE',
                    xhrFields: {withCredentials: true}
                })
                .success(data => {
                    this.get('_items').removeObject(item_);
                })
                .fail(data => {
                    debugger
                }).then(() => this.set('modalOpen', false));
            }
        },
        sort(by, order) {
            let sorted = this.get('_items').sortBy(by);
            this.set('_items', order === 'asc' ? sorted : sorted.reverse());
        },
        toggleText(which) {
            this.set('textValue', null);
            this.toggleProperty(which);
        },
        openModal(modalType) {
            this.set('modalOpen', modalType);
        },
        closeModal(pre) {
            this.set('modalOpen', false);
        },
        navigateToItem(item) {
            let breadcrumbs = this.get('breadcrumbs');
            let index = breadcrumbs.indexOf(item);
            if (index === -1) {
                // TODO: Valid to assume item is a child of currentParent?
                breadcrumbs.pushObject(item);
            } else {
                let slicedBread = breadcrumbs.slice(0, index + 1);
                this.set('breadcrumbs', Ember.A(slicedBread));
            }
            // this.set('currentParent', item);

        },

        navigateUp() {
            let breadcrumbs = this.get('breadcrumbs');
            if (breadcrumbs.length === 1) {
                return;
            }
            breadcrumbs.popObject();
        }
    }
});
