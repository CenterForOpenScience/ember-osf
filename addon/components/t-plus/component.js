import Ember from 'ember';
import layout from './template';

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

const tPlus = Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    theme: Ember.inject.service(),
    didReceiveAttrs() {
        let locale = this.get('i18n.locale');
        // let language = require(`../locales.${locale}.translations`); //TODO: look into dynamic loading of different languages, allowing
        //                                                              //allowing for preprintWords to be defined in the translations file
        // this.set('preprintWords', language.preprintWords);
        this.set('preprintWords', preprintWords[locale] ? preprintWords[locale] : preprintWords.en);
    },
    translation: Ember.computed('text', function(){
        let theme = this.get('theme');
        return this.get('preprintWords')[theme && theme.provider ? theme.provider.preprintWord || 'paper' : 'preprint'];
    })
});

tPlus.reopenClass({
  positionalParams: ['text']
});

export default tPlus;
