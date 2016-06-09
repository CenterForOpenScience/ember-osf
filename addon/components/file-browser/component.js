import Ember from 'ember';
import layout from './template';

// use: {{file-browser rootNode=node onClickFile=(action) onClickNode=(action)}}
export default Ember.Component.extend({
  layout,
  classNames: ['file-browser']
});
