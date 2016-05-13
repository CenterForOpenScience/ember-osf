import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    size: DS.attr('number'),
    contentType: DS.attr('string'),
});
