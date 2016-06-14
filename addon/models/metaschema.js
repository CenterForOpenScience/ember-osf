import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    name: DS.attr('string'),
    schemaVersion: DS.attr('number'),
    schema: DS.attr()
});
