import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    classNames: ['dropzone'],
    didRender(){
        var _this = this;
        this.buildUrl = this.get('buildUrl');
        var preUpload = this.get('preUpload');
        var dropzoneOptions = this.get('options');
        var listeners = this.get('listeners');
        if (!this.attrs.buildUrl && !preUpload && (!this.dropzoneOptions || !this.dropzoneOptions.url)){
            console.error('');
        }
        var drop = new Dropzone('#' + this.elementId, {
            url: file => typeof this.attrs.buildUrl === 'function' ? this.attrs.buildUrl(file) : this.get('buildUrl'),
            autoProcessQueue: false,
        })
        drop.on('addedfile', file => {
            if (preUpload){
                preUpload(this, drop, file).then( () => drop.processFile(file) );
            } else {
                drop.processFile(file);
            }
        })
        drop.options = Ember.$.extend({}, drop.options, dropzoneOptions);
        if (listeners && typeof listeners === 'object'){
            Object.keys(listeners).map( each => drop.on(each, listeners[each]) )
        }
    }
});
