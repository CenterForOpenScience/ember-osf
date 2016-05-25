import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('file-version', {
  default: {
      size: FactoryGuy.generate(() => faker.random.number()),
      contentType: FactoryGuy.generate(() => faker.system.mimeType()),
  }
});
