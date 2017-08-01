export default {
    // "some.translation.key": "Text for some.translation.key",
    //
    // "a": {
    //   "nested": {
    //     "key": "Text for a.nested.key"
    //   }
    // },
    //
    // "key.with.interpolation": "Text with {{anInterpolation}}"
    preprintWords: {
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
    },
    eosf: {
        signup: {
            headingTitle: 'Create a free account',
            labelInputName: 'Full name',
            labelInputEmail: 'Email',
            labelConfirmEmail: 'Confirm Email',
            placeholderConfirmEmail: 'Re-enter email',
            labelInputPassword: 'Password',
            textTosNotice: 'By clicking "Create account", you agree to our <a href="https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/TERMS_OF_USE.md">Terms</a> and that you have read our <a href="https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/PRIVACY_POLICY.md">Privacy Policy</a>, including our information on <a href="https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/PRIVACY_POLICY.md#f-cookies">Cookie Use</a>.',
            buttonSubmit: 'Create account'
        },
        navbar: {
            add: 'Add',
            addAPreprint: 'Add a {{preprintWords.preprint}}',
            browse: 'Browse',
            cancelSearch: 'Cancel search',
            donate: 'Donate',
            goHome: 'Go home',
            myProjects: 'My Projects',
            search: 'Search',
            searchHelp: 'Search help',
            searchTheOSF: 'Search the OSF',
            sendSearch: 'Send search query',
            support: 'Support',
            togglePrimary: 'Toggle primary navigation',
            toggleSecondary: 'Toggle secondary navigation',
        },
        authDropdown: {
            logOut: 'Log out',
            myProfile: 'My Profile',
            osfSupport: 'OSF Support',
            settings: 'Settings',
            signUp: 'Sign Up',
            signIn: 'Sign in',
            toggleAuthDropdown: 'Toggle auth dropdown'
        },
        searchHelpModal: {
            close: 'Close',
            searchHelp: 'Search help',
            queries: 'Queries',
            searchUsesThe: 'Search uses the ',
            searchSyntax: 'search syntax',
            helpDescription: 'This gives you many options, but can be very simple as well. Examples of valid searches include:'
        },
        components: {
            searchResult: {
                addedOn: 'Added on',
                lastEdited: 'Last edited',
                showResult: 'Expand search result',
                withdrawn: 'Withdrawn'

            },
            discoverPage: {
                activeFilters: {
                    heading: 'Active Filters',
                    button: 'Clear filters'
                },
                search: 'Search',
                searchPlaceholder: 'Search...',
                poweredBy: 'powered by',
                noResults: 'No results. Try removing some filters.',
                asOf: 'as of',
                sortBy: 'Sort by',
                partnerRepositories: 'Partner Repositories',
                refineSearch: 'Refine your search by',
                noResultsFound: 'No results found.',
                broadenSearch: 'Try broadening your search terms',
                shareUnavailable: 'Search is Unavailable',
                luceneHelp: 'Lucene search help',
                removeProvider: 'Remove provider',
                removeSubject: 'Remove subject',
                removeRegistrationType: 'Remove registration type',
                shareUnavailableDescription: 'SHARE Search is temporarily unavailable. We have been notified and are working to fix the problem. Please try again later.',
                searchLoading: 'Search loading',
                sortSearchResults: 'Sort search results',
                source: `Source`,
                date: `Date`,
                type: `Type`,
                tag: `Tag`,
                publisher: `Publisher`,
                funder: `Funder`,
                language: `Language`,
                people: `People`

            },
            querySyntax: {
                couldNotPerformQuery: "Could not perform search query.",
                moreInformationOnSearch: "Please see below for more information on advanced search queries.",
                reservedChars: "Reserved Characters",
                specialMeanings: "The following characters have special meanings in a query",
                escapeReservedChars: " If you want to use any of these reserved characters in your query, escape them with a leading backslash. For instance, to search for ",
                needToType: "you would need to type",
                searchByField: "Searching by Field",
                allFieldsSearched: "By default, all available fields are searched, but you can choose to search specific fields instead",
                titleContainsWord: "The title contains the word",
                descriptionContainsPhrase: "The description contains the exact phrase",
                listContainsExactPhrase: "The list of contributor names contains the exact phrase",
                listOfIdentifiersContains: "The list of identifiers contains",
                booleanOperators: "Boolean Operators",
                booleanDesc1: "By default, all terms in the query are optional, as long as one term matches. You can use boolean operators",
                booleanDesc2: "to have more control over the search",
                booleanDesc3: "The word",
                must: "must",
                mustNot: "must not",
                both: "both",
                theWord: "the word",
                booleanDesc4: "be present. The words",
                and: "and",
                or: "or",
                except: "except",
                excluding: "excluding",
                booleanDesc5: "are optional but used for sorting by relevance",
                booleanDesc6: "Same as above, except the word",
                booleanDesc7: "be present",
                booleanDesc8: "Equivalent to",
                booleanDesc9: "The word",
                booleanDesc10: "The list of tags contains",
                wildcards: "Wildcards",
                wildcardsDesc1: "Use wildcards to match multiple terms at once. Use",
                wildcardsDesc2: "to match any single character, or",
                wildcardsDesc3: "to match zero or more characters.",
                matchWordStartsWith: "Match any word that starts with",
                match: "Match",
                fuzziness: "Fuzziness",
                use: "Use",
                fuzzinessDesc1: "after a word to indicate a 'fuzzy' search, to include matches that are similar but not exactly the same.",
                thisUsesThe: "This uses the",
                damerauLevenshteinDistanceDesc: "to match all words with at most 1 change. You can specify a different maximum edit distance with a number after the",
                phraseProximity: "Phrase Proximity",
                phraseProximityDesc1: "You can also specify a maximum edit distance for phrases, to allow the words in the phrase to be farther apart or in a different order.",
                butNot: "but not",
                ranges: "Ranges",
                rangesDesc1: "Use brackets to specify ranges for a field. Square brackets",
                rangesDesc2: "indicate inclusive ranges and curly brackets",
                rangesDesc3: "indicate exclusive ranges",
                allDatesIn: "all dates in",
                allTagsBetween: "all tags between",
                boosting: "Boosting",
                boostingDesc1: "Use the boost operator",
                boostingDesc2: "with a number to make one term more relevant than another. The boost can be any positive number. Boosts between 0 and 1 reduce relevance.",
                boostingDesc3: "Boost results with",
                boostingDesc4: "higher than results with just",
                moreInformation: "More Information",
                moreInfoQuerySyntax: "For more details about query syntax, see the",
                documentation: "documentation"
            },
            searchFacetDaterange: {
                modifyDate: 'Modify daterange',
                allTime: 'All time'
            },
            searchFacetLanguage: {
                add: 'Add'
            },
            searchFacetSource: {
                'source': 'Source',
                'sources': 'Sources'
            },
            searchFacetWorktypeButton: {
                expandWorktype: 'Expand or contract worktype',
                removeWorktypeFilter: 'Remove worktype filter'
            },
            searchHelpModal: {
                close: 'Close',
                searchHelp: 'Search help',
                queries: 'Queries',
                searchUsesThe: 'Search uses the ',
                searchSyntax: 'search syntax',
                helpDescription: 'This gives you many options, but can be very simple as well. Examples of valid searches include:'
            },
            totalShareResults: {
                'searchablePreprints': `{{count}} searchable {{preprintWords.preprints}}`,
                'searchableRegistries': `{{count}} searchable registrations`,
                'searchableEvents': `{{count}} searchable events`,
            }
        }
    }
};
