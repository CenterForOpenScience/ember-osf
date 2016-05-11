import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    size: DS.attr('number'),
    contentType: DS.attr('string'),
});
