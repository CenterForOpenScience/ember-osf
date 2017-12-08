import preprintWord from 'dummy/utils/preprint-word';
import { module, test } from 'qunit';

module('Unit | Utility | preprint word');

test('preprint-word works', function(assert) {
  let result = preprintWord();
  const expected =
      {
          document: {
              plural: 'documents',
              pluralCapitalized: 'Documents',
              singular: 'document',
              singularCapitalized: 'Document',
          },
          paper: {
              plural: 'papers',
              pluralCapitalized: 'Papers',
              singular: 'paper',
              singularCapitalized: 'Paper',
          },
          preprint: {
              plural: 'preprints',
              pluralCapitalized: 'Preprints',
              singular: 'preprint',
              singularCapitalized: 'Preprint',
          },
          none: {
              plural: '',
              pluralCapitalized: '',
              singular: '',
              singularCapitalized: '',
          },
          thesis: {
              plural: 'theses',
              pluralCapitalized: 'Theses',
              singular: 'thesis',
              singularCapitalized: 'Thesis',
          },

      };
  assert.deepEqual(result, expected);
});
