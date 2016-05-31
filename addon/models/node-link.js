import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    targetNode: DS.belongsTo('node')

});
