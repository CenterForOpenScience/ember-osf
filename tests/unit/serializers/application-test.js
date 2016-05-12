import { moduleForModel, test } from 'ember-qunit';
import { faker } from 'ember-cli-mirage';
// TODO: Move this to the osf-serializer tests file
moduleForModel('base', 'Unit | Serializer | application', {
  needs: ['serializer:application']
});

test('#_mergeFields adds links to attributes if included in payload', function(assert) {
    let payload = {
        id: faker.random.uuid(),
        type: 'base',
        attributes: {
            key: 'value'
        },
        links: {
            html: faker.internet.url()
        }
    };
    let serializer = this.container.lookup('serializer:application');
    let normalized = serializer._mergeFields(payload);
    assert.equal(normalized.attributes.links, payload.links);
});
test('#_mergeFields adds embeds to attributes if included in payload', function(assert) {
    let payload = {
        id: faker.random.uuid(),
        attributes: {
            key: 'value'
        },
        embeds: {
            embedded: {
                data: [faker.random.arrayElement()]
            }
        }
    };
    let serializer = this.container.lookup('serializer:application');
    let normalized = serializer._mergeFields(payload);

    assert.equal(normalized.attributes.embeds, payload.embeds);
});
