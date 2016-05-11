import ApplicationSerializer from './application';


export default ApplicationSerializer.extend({
  serialize: function(snapshot, options) {
      // Don't send relationships to the server; this can lead to 500 errors.
      var serialized = snapshot.attributes().data_

      return {data: serialized};
  }
});
