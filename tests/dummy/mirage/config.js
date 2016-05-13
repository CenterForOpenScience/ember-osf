export default function() {

    // These comments are here to help you get started. Feel free to delete them.

    /*
      Config (with defaults).

      Note: these only affect routes defined *after* them!
    */

    this.urlPrefix = 'http://localhost:8000';
    this.namespace = 'v2';
    // this.timing = 400;      // delay for each request, automatically set to 0 during testing

    this.get('/users/', (schema) => schema.user.all());
    this.get('/users/:id/', (schema, request) => schema.user.find(request.params.id));
    this.get('/users/:id/nodes', (schema, request) => schema.user.find(request.params.id).nodes.all());
    this.get('/users/:id/relationships/institutions/', (schema, request) => schema.user.find(request.params.id).institutions.all());
    this.get('/users/:id/registrations/', (schema, request) => schema.user.find(request.params.id).registrations.all());

    this.get('/nodes/', (schema) => schema.node.all());
    this.get('/nodes/:id/', (schema, request) => schema.node.find(request.params.id));
    this.get('/nodes/:id/contributors/', (schema, request) => schema.node.find(request.params.id).contributors.all());
    this.get('/nodes/:id/logs/', (schema, request) => schema.node.find(request.params.id).logs.all());

    this.get('/registrations/', (schema) => schema.registration.all());
    this.get('/registrations/:id/', (schema, request) => schema.registration.find(request.params.id));
    this.get('/registrations/:id/contributors/', (schema, request) => schema.registration.find(request.params.id).contributors.all());
    this.get('/registrations/:id/logs/', (schema, request) => schema.registration.find(request.params.id).logs.all());

    this.get('/logs/', (schema) => schema.log.all());
    this.get('/logs/:id/', (schema, request) => schema.log.find(request.params.id));
    this.get('/logs/:id/contributors/', (schema, request) => schema.log.find(request.params.id).contributors.all());

    this.get('/institutions/', (schema) => schema.institution.all());
    this.get('/institutions/:id/nodes/', (schema, request) => schema.institution.find(request.params.id).nodes.all());
    this.get('/institutions/:id/registrations/', (schema, request) => schema.institution.find(request.params.id).registrations.all());
    this.get('/institutions/:id/users/', (schema, request) => schema.institution.find(request.params.id).users.all());

    /*
      Shorthand cheatsheet:
      this.get('/posts');
      this.post('/posts');
      this.get('/posts/:id');
      this.put('/posts/:id'); // or this.patch
      this.del('/posts/:id');
    */
}
