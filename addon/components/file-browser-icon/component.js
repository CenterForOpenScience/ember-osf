import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  tagName: 'span',
  classNames: ['file-browser-icon'],

  click() {
      this.toggleProperty('row.expanded');
  }
});
