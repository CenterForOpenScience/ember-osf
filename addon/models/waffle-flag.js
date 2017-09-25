import DS from 'ember-data';
import OsfModel from 'ember-osf/models/osf-model';

export default OsfModel.extend({
    name: DS.attr('fixstring'),
    note: DS.attr('fixstring'),
    active: DS.attr('boolean'),
    flagDefault: DS.attr('boolean')
});
