/* global Dropzone */

import Ember from 'ember';
import config from 'ember-get-config';

import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Support file uploads via dropzone.
 * Accepts dropzone event listeners as parameters (e.g. success, error, addedfile)
 *
 * Sample usage:
 * ```handlebars
 * {{dropzone-widget
 *   preUpload=attrs.preUpload
 *   buildUrl=buildUrl
 *   success=attrs.success
 *   defaultMessage=defaultMessage
 *   options=dropzoneOptions}}
 * ```
 *
 * @class dropzone-widget
 */
export default Ember.Component.extend({
    layout,
    session: Ember.inject.service(),
    classNameBindings: ['dropzone'],
    dropzone: true,
    enable: true,
    loadDropzone() {
        let preUpload = this.get('preUpload');
        let dropzoneOptions = this.get('options') || {};

        class CustomDropzone extends Dropzone {
            drop(e) {
                if (!e.dataTransfer ) {
                    return;
                }
                this.emit("drop", e);
                let files = e.dataTransfer.files;
                let items = e.dataTransfer.items;
                if (files.length === 0) {
                    this.emit('error', 'None', 'Cannot upload directories, applications, or packages');
                    return;
                }
                if (dropzoneOptions.preventMultipleFiles && items.length > 1) {
                    this.emit('error', 'None', 'Cannot upload multiple files');
                    return;
                }
                this.emit("addedfiles", files);
                if (files.length) {
                    if (items && items.length && (items[0].webkitGetAsEntry != null)) {
                        this._addFilesFromItems(items);
                    } else {
                        this.handleFiles(files);
                    }
                }
            }
        }
        let drop = new CustomDropzone(`#${this.elementId}`, {
            url: file => typeof this.get('buildUrl') === 'function' ? this.get('buildUrl')(file) : this.get('buildUrl'),
            autoProcessQueue: false,
            dictDefaultMessage: this.get('defaultMessage') || 'Drop files here to upload',
            sending(file, xhr) {
                // Monkey patch to send the raw file instead of formData
                xhr.send = xhr.send.bind(xhr, file);
            }
        });

        // Set osf session header
        let headers = {};

        let authType = config['ember-simple-auth'].authorizer;
        this.get('session').authorize(authType, (headerName, content) => {
            headers[headerName] = content;
        });
        dropzoneOptions.headers = headers;
        dropzoneOptions.withCredentials = (config.authorizationType === 'cookie');

        // Attach preUpload to addedfile event
        drop.on('addedfile', file => {
            if (preUpload) {
                preUpload(this, drop, file).then(() => drop.processFile(file));
            } else {
                drop.processFile(file);
            }
        });

        // Set dropzone options
        drop.options = Ember.merge(drop.options, dropzoneOptions);

        // Attach dropzone event listeners: http://www.dropzonejs.com/#events
        drop.events.forEach(event => {
            if (typeof this.get(event) === 'function') {
                drop.on(event, (...args) => this.get(event)(this, drop, ...args));
            }
        });
    },
    _wasEnabled: Ember.observer('enable', function() {
        if (this.get('enable') && this.get('loaded') && !this.get('attached')) {
            this.set('attached', true);
            this.loadDropzone();
        }
    }),
    didInsertElement() {
        this.set('loaded', true);
        if (!this.get('enable')) {
            return;
        }
        this.loadDropzone();
    }
});
