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
        }
    }
}

export default tHelper.extend({
    theme: Ember.inject.service(),
    compute(_, params) {
        let locale = this.get('i18n.locale') || 'en';
        let preprintWord = this.get('theme.provider.preprintWord') || 'preprint';
        params = params || {};
        params.preprintWords = preprintWords[locale][preprintWord];
        return this._super(_, params);
    }
})
