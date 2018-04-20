import Ember from 'ember';

export default Ember.Service.extend({
    i18n: Ember.inject.service(),
    getPreprintWord() {
        const i18n = this.get('i18n');
        return {
            default: {
                plural: i18n.t('documentType.default.plural'),
                pluralCapitalized: i18n.t('documentType.default.pluralCapitalized'),
                singular: i18n.t('documentType.default.singular'),
                singularCapitalized: i18n.t('documentType.default.singularCapitalized'),
            },
            paper: {
                plural: i18n.t('documentType.paper.plural'),
                pluralCapitalized: i18n.t('documentType.paper.pluralCapitalized'),
                singular: i18n.t('documentType.paper.singular'),
                singularCapitalized: i18n.t('documentType.paper.singularCapitalized'),
            },
            preprint: {
                plural: i18n.t('documentType.preprint.plural'),
                pluralCapitalized: i18n.t('documentType.preprint.pluralCapitalized'),
                singular: i18n.t('documentType.preprint.singular'),
                singularCapitalized: i18n.t('documentType.preprint.singularCapitalized'),
            },
            none: {
                plural: '',
                pluralCapitalized: '',
                singular: '',
                singularCapitalized: '',
            },
            thesis: {
                plural: i18n.t('documentType.thesis.plural'),
                pluralCapitalized: i18n.t('documentType.thesis.pluralCapitalized'),
                singular: i18n.t('documentType.thesis.singular'),
                singularCapitalized: i18n.t('documentType.thesis.singularCapitalized'),
            },
        }
    }
});
