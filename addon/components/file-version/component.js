import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    classNames: ['file-version'],
    tagName: 'tr',

    actions: {
        downloadVersion(version) {
            this.sendAction('download', version);
        }
    }
});
