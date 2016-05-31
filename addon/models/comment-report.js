import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    category: DS.attr('string'),
    text: DS.belongsTo('comment')
});
