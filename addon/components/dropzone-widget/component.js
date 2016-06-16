import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['dropzone'],
  didRender(){
      var _this = this;
      _this.defineUrl = this.get('defineUrl');
      _this.prefileCheck = this.get('prefileCheck');
      _this.dropzoneOptions = this.get('options');
      _this.listeners = this.get('listeners');
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
      if (_this.listeners && typeof _this.listeners === 'object'){
          Object.keys(_this.listeners).map(function(each){
              drop.on(each, _this.listeners[each])
          })
      }
  }
});
