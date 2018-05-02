import DS from 'ember-data';
import OsfModel from './osf-model';

export default OsfModel.extend({
    permissionGroup: DS.attr('string'),
    fullName: DS.attr('string'),
    email: DS.attr('string'),
});
