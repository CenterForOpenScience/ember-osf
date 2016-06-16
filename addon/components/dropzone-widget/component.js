import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    classNames: ['dropzone'],
    didRender(){
        var _this = this;
        this.defineUrl = this.get('defineUrl');
        /*
            If defineUrl is not defined, prefileCheck needs to attach a defineUrl
            to the Component instance passed to it as ` drop `. PrefileCheck, id
            defined, also needs to handle, at some point, calling one of drop's
            .process methods.
        */
        this.prefileCheck = this.get('prefileCheck');
        this.dropzoneOptions = this.get('options');
        this.listeners = this.get('listeners');
        if (!this.defineUrl && !this.prefileCheck){
            console.error('');
        }
        var drop = new Dropzone('#' + _this.elementId, {
            url: function(file){
                return typeof _this.defineUrl === 'function' ? _this.defineUrl(file) : _this.defineUrl;
            },
            autoProcessQueue: false,
        })
        drop.on('addedfile', function(file){
            if (_this.prefileCheck){
                _this.prefileCheck(_this, drop, file);
            } else {
                drop.processFile(file);
            }
        })
        drop.options = Ember.$.extend({}, drop.options, _this.dropzoneOptions);
        if (this.listeners && typeof this.listeners === 'object'){
            Object.keys(_this.listeners).map(function(each){
                drop.on(each, _this.listeners[each])
            })
        }
    }
});
