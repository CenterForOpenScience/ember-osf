import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from './osf-model';
import FileBrowserItemMixin from 'ember-osf/mixins/file-browser-item';

export default OsfModel.extend(FileBrowserItemMixin, {
    name: DS.attr('string'),
    kind: DS.attr('string'),
    path: DS.attr('string'),
    provider: DS.attr('string'),
    files: DS.hasMany('file'),
    node: DS.belongsTo('node'),
});
