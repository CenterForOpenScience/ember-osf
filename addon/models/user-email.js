import DS from 'ember-data';
import OsfModel from './osf-model'

export default OsfModel.extend({
    confirmed: DS.attr('boolean'),
    emailAddress: DS.attr('fixstring'),
    primary: DS.attr('boolean'),
});

