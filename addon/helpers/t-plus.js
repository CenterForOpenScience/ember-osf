import Ember from 'ember';
import tHelper from "ember-i18n/helper";

const preprintWords = {
    en: {
        preprint: {
            preprint: 'preprint',
            preprints: 'preprints',
            Preprint: 'Preprint',
            Preprints: 'Preprints'
        },
        paper: {
            preprint: 'paper',
            preprints: 'papers',
            Preprint: 'Paper',
            Preprints: 'Papers'
        },
        thesis: {
            preprint: 'thesis',
            preprints: 'theses',
            Preprint: 'Thesis',
            Preprints: 'Theses'
        },
        none: {
            preprint: '',
            preprints: '',
            Preprint: '',
            Preprints: ''
        }
    }
}

export default tHelper.extend({
    theme: Ember.inject.service(),
    compute(_, params) {
        let locale = preprintWords[this.get('i18n.locale')] || preprintWords.en;
        let preprintWord = locale[this.get('theme.provider.preprintWord')] || locale.preprint;
        params = params || {};
        params.preprintWords = preprintWord;
        return this._super(_, params);
    }
})
