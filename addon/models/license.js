import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    name: DS.attr('string'),
    text: DS.attr('string'),
    requiredFields: DS.attr()
});
