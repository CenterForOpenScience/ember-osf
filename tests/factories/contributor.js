import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('contributor', {
    default: {
        bibliographic: true,
        permission: 'admin',  // Must be one of read, write, or admin
        // nodeID: // TODO: Field not defined in serializer. Find out meaning and add to factory.
    }
});
