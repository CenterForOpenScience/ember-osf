import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  tagName: 'span',
  classNames: ['file-browser-icon'],

  click() {
      if (this.get('row.isExpandable')) {
          this.toggleProperty('row.expanded');
      }
  },

  iconName: Ember.computed('row', 'row.expanded', function() {
      // TODO: More icons!
      if (this.get('row.isNode')) {
          // TODO type of node
          return 'cube';
      }
      if (this.get('row.isProvider')) {
          // TODO provider-specific
          return 'hdd-o';
      }
      if (this.get('row.isFolder')) {
          return this.get('row.expanded') ? 'folder-open' : 'folder';
      }
      // TODO file types
      return 'file-o';
  })
});
