import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    classNames: ['dropzone'],
    didRender(){
        var _this = this;
        this.defineUrl = this.get('defineUrl');
        var prefileCheck = this.get('prefileCheck');
        var dropzoneOptions = this.get('options');
        var listeners = this.get('listeners');
        if (!this.attrs.defineUrl && !prefileCheck){
            console.error('');
        }
        var drop = new Dropzone('#' + this.elementId, {
            url: file => typeof this.attrs.defineUrl === 'function' ? this.attrs.defineUrl(file) : this.get('defineUrl'),
            autoProcessQueue: false,
        })
        drop.on('addedfile', file => {
            if (prefileCheck){
                prefileCheck(this, drop, file).then( () => drop.processFile(file) );
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
