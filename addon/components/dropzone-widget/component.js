import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Support file uploads via dropzone.
 *
 * Sample usage:
 * ```handlebars
 * {{dropzone-widget
 *   preUpload=attrs.preUpload
 *   buildUrl=buildUrl
 *   listeners=dropzoneListeners
 *   options=dropzoneOptions}}
 * ```
 *
 * @class dropzone-widget
 */
export default Ember.Component.extend({
    layout,
    session: Ember.inject.service(),
    classNames: ['dropzone'],
    didRender() {
        var preUpload = this.get('preUpload');
        var dropzoneOptions = this.get('options');
        var listeners = this.get('listeners');
        if (!this.get('buildUrl') && !preUpload && (!dropzoneOptions || !dropzoneOptions.url)) {
            console.error('Need to define url somewhere');
        }
        var drop = new Dropzone('#' + this.elementId, {  // jshint ignore:line
            url: file => typeof this.get('buildUrl') === 'function' ? this.get('buildUrl')(file) : this.get('buildUrl'),
            autoProcessQueue: false,
        });

        let headers = {};
        this.get('session').authorize('authorizer:osf-token', (headerName, content) => {
            headers[headerName] = content;
        });

        drop.options.headers = headers;
        drop.on('addedfile', file => {
            if (preUpload) {
                preUpload(this, drop, file).then(() => drop.processFile(file));
            } else {
                drop.processFile(file);
            }
        });
        drop.options = Ember.merge(drop.options, dropzoneOptions);
        if (listeners && typeof listeners === 'object') {
            Object.keys(listeners).map(each => drop.on(each, listeners[each]));
        }
    }
});
