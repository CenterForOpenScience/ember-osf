import DS from 'ember-data';

import OsfModel from './osf-model';
import FileItemMixin from 'ember-osf/mixins/file-item';

export default OsfModel.extend(FileItemMixin, {
    name: DS.attr('string'),
    kind: DS.attr('string'),
    path: DS.attr('string'),
    provider: DS.attr('string'),
    files: DS.hasMany('file'),
    node: DS.belongsTo('node'),
});
