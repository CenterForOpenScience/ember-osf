import {
    Model,
    belongsTo
} from 'ember-cli-mirage';

export default Model.extend({
    node: belongsTo('node'),
    originalNode: belongsTo('node'),
    user: belongsTo('user'),
    linkedNode: belongsTo('node'),
    templateNode: belongsTo('node')
});
