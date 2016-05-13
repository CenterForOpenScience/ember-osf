import {
    belongsTo,
    hasMany
} from 'ember-cli-mirage';

import NodeMirageModel from './node';

export default NodeMirageModel.extend({
    registeredFrom: belongsTo('node'),
    registeredBy: belongsTo('user'),
    contributors: hasMany('contributors')
    // comments: hasMany('comments')
});
