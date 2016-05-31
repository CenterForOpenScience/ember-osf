import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    size: DS.attr('number'),
    contentType: DS.attr('string')
});
