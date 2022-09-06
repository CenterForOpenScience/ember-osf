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
    documentType: {
        default: {
            plural: 'documents',
            pluralCapitalized: 'Documents',
            singular: 'document',
            singularCapitalized: 'Document',
        },
        work: {
            plural: 'works',
            pluralCapitalized: 'Works',
            singular: 'work',
            singularCapitalized: 'Work',
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
        thesis: {
            plural: 'theses',
            pluralCapitalized: 'Theses',
            singular: 'thesis',
            singularCapitalized: 'Thesis',
        },
        supplementalProject: {
            plural: 'supplemental projects',
            pluralCapitalized: 'Supplemental Projects',
            singular: 'supplemental project',
            singularCapitalized: 'Supplemental Project',
        }
    },
    eosf: {
        authDropdown: {
            altUserGravatar: 'User profile image',
            logOut: 'Log Out',
            myProfile: 'My Profile',
            osfSupport: 'OSF Support',
            settings: 'Settings',
            signUp: 'Sign Up',
            signIn: 'Sign In',
            support: 'Support',
            toggleAuthDropdown: 'Toggle auth dropdown'
        },
        footer: {
            api: 'API',
            centerForOpenScience: 'Center for Open Science',
            donate: 'Donate',
            explore: 'Explore',
            faqGuides: 'FAQ/Guides',
            home: 'Home',
            osf: 'OSF',
            reproducibilityProjectPsychology: 'Reproducibility Project: Psychology',
            reproducibilityProjectBiology: 'Reproducibility Project: Cancer Biology',
            socialize: 'Socialize',
            sourceCode: 'Source Code',
            topGuidelines: 'TOP Guidelines'
        },
        navbar: {
            add: 'Add',
            addAPreprint: 'Add a {{documentType.singularCapitalized}}',
            altSearchOSF: 'Search OSF',
            browse: 'Browse',
            cancelSearch: 'Cancel search',
            dashboard: 'Dashboard',
            donate: 'Donate',
            goHome: 'Go home',
            meetings: 'Meetings',
            myPreprints: 'My Preprints',
            myProjects: 'My Projects',
            myQuickFiles: 'My Quick Files',
            newProjects: 'New Projects',
            openScienceFramework: 'Open Science Framework',
            osf: 'OSF',
            preprints: 'Preprints',
            registries: 'Registries',
            reviews: 'My Reviewing',
            search: 'Search',
            searchHelp: 'Search help',
            searchTheOSF: 'Search the OSF',
            sendSearch: 'Send search query',
            support: 'Support',
            toggleNavigation: 'Toggle navigation',
            togglePrimary: 'Toggle primary navigation',
            toggleSecondary: 'Toggle secondary navigation'
        },
        osfModeFooter: {
            runningInDevelopmentMode: ': This site is running in development mode.',
            warning: 'WARNING'
        },
        projectNavbar: {
            analytics: 'Analytics',
            comments: 'Comments',
            contributors: 'Contributors',
            files: 'Files',
            forks: 'Forks',
            navigation: 'Navigation',
            privateParentMessage: 'Parent project is private',
            registrations: 'Registrations',
            settings: 'Settings',
            toggleNavigation: 'Toggle navigation',
            wiki: 'Wiki'
        },
        searchHelpModal: {
            close: 'Close',
            helpDescription: 'This gives you many options, but can be very simple as well. Examples of valid searches include:',
            queries: 'Queries',
            searchHelp: 'Search help',
            searchSyntax: 'search syntax',
            searchUsesThe: 'Search uses the '
        },
        signup: {
            buttonSubmit: 'Create account',
            headingTitle: 'Create a free account',
            labelConfirmEmail: 'Confirm Email',
            labelInputEmail: 'Email',
            labelInputName: 'Full name',
            labelInputPassword: 'Password',
            placeholderConfirmEmail: 'Re-enter email',
            textTosNotice: 'By clicking "Create account", you agree to our <a href="https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/TERMS_OF_USE.md">Terms</a> and that you have read our <a href="https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/PRIVACY_POLICY.md">Privacy Policy</a>, including our information on <a href="https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/PRIVACY_POLICY.md#f-cookies">Cookie Use</a>.'
        },
        components: {
            citationWidget: {
                apa: 'APA',
                chicago: 'Chicago',
                getMoreCitations: 'Get more citations',
                loadingMessage: 'Searching...',
                mla: 'MLA',
                noMatchesMessage: 'No matches found',
                searchMessage: 'Please enter a few characters',
                placeholderMessage: 'Enter citation style (e.g., "APA")',
            },
            commenting: {
                commentDetail: {
                    commentDeleted: 'Comment deleted',
                    delete: 'Delete',
                    edit: 'Edit',
                    report: 'Report',
                    restore: 'Restore'
                },
                commentForm: {
                    addComment: 'Add comment'
                },
                commentPane: {
                    comments: 'Comments',
                    none: '(none)'
                }
            },
            discoverPage: {
                activeFilters: {
                    button: 'Clear filters',
                    heading: 'Active Filters'
                },
                asOf: 'as of',
                broadenSearch: 'Try broadening your search terms',
                date: `Date`,
                funder: `Funder`,
                language: `Language`,
                luceneHelp: 'Lucene search help',
                noResults: 'No results. Try removing some filters.',
                noResultsFound: 'No results found.',
                partnerRepositories: 'Partner Repositories',
                people: `People`,
                poweredBy: 'powered by',
                publisher: `Publisher`,
                refineSearch: 'Refine your search by',
                removeProvider: 'Remove provider',
                removeRegistrationType: 'Remove registration type',
                removeSubject: 'Remove subject',
                search: 'Search',
                searchInputBox: 'Search input box',
                searchLoading: 'Search loading',
                searchPlaceholder: 'Search...',
                share: 'SHARE',
                shareUnavailable: 'Search is Unavailable',
                shareUnavailableDescription: 'SHARE Search is temporarily unavailable. We have been notified and are working to fix the problem. Please try again later.',
                sortBy: 'Sort by',
                sortSearchResults: 'Sort search results',
                source: `Source`,
                tag: `Tag`,
                type: `Type`
            },
            fileBrowser: {
                delete: 'Delete',
                deleteMultiple: 'Delete multiple',
                download: 'Download',
                downloads: 'Downloads',
                downloadZip: 'Download as zip',
                dropzoneWidget: {
                    placeholderText: 'Drop files here to upload',
                    uploadText: 'Drop file to upload',
                    userHasNotUploadedFiles: 'This user has not uploaded any quickfiles'
                },
                filter: 'Filter',
                loading: 'Loading...',
                modals: {
                    deleteItem: {
                        buttons: {
                            cancel: 'Cancel',
                            delete: 'Delete'
                        },
                        deleteMessageEnd: '" ?',
                        deleteMessageStart: 'Delete "'
                    },
                    deleteMultiple: {
                        buttons: {
                            cancel: 'Cancel',
                            delete: 'Delete'
                        },
                        deleteMessage: 'Delete multiple?'
                    },
                    instructions: {
                        close: 'Close',
                        downloadZip: 'Download as zip:',
                        downloadZipMessage: 'Click the Download as Zip button in the toolbar to download all files as a .zip.',
                        folders: 'Folders:',
                        foldersMessage: 'Not supported; consider an OSF project for uploading and managing many files.',
                        howToUse: 'How to use the file browser',
                        openFile: 'Open files:',
                        openFileMessage: 'Click a file name to go to view the file in the OSF.',
                        openFileTab: 'Open files in new tab:',
                        openFileTabMessage: 'Press Command (Ctrl in Windows) and click a file name to open it in a new tab.',
                        select: 'Select rows:',
                        selectMessage: 'Click on a row to show further actions in the toolbar. Use Command or Shift keys to select multiple files.',
                        upload: 'Upload:',
                        uploadMessage: 'Single file uploads via drag and drop or by clicking the upload button.'
                    },
                    irreversibleMessage: 'This action is irreversible.',
                    moveFile: {
                        buttons: {
                            back: 'Back',
                            cancel: 'Cancel',
                            moveFile: 'Move file'
                        },
                        moveFileMessage: 'Move file to project'
                    },
                    renameConflict: {
                        buttons: {
                            cancel: 'Cancel',
                            keepBoth: 'Keep Both',
                            replace: 'Replace'
                        },
                        conflictMessageEnd: ' already exists in this location.',
                        conflictMessageStart: 'An item named ',
                        keepBoth: '"Keep Both" will retain both files (and their version histories) in this location.',
                        replace: '"Replace" will overwrite the existing file in this location. You will lose previous versions of the overwritten file. You will keep previous versions of the moved file.'
                    }
                },
                modified: 'Modified',
                move: 'Move',
                name: 'Name',
                rename: 'Rename',
                size: 'Size',
                share: 'Share',
                upload: 'Upload',
                version: 'Version',
                view: 'View'
            },
            fileChooser: {
                chosenFiles: 'Chosen files',
                dragAndDropMessage: 'You can also drag and drop a file from your computer.',
                error: 'Error:'
            },
            fileEditor: {
                edit: 'Edit',
                revert: 'Revert',
                save: 'Save'
            },
            fileWidget: {
                back: 'Back',
                chooseAnOSFProject: 'Choose an OSF project:',
                loginToOSF: 'Login to OSF'
            },
            licensePicker: {
                chooseALicense: 'Choose a license:',
                copyrightHolders: 'Copyright Holders:',
                licenseFAQ: 'License FAQ',
                required: '(required)',
                save: 'Save',
                year: 'Year:'
            },
            fileRenderer: {
                mfrTitle: 'Rendering of document'
            },
            maintenanceBanner: {
                and: 'and',
                notice: 'Notice:',
                thankYou: 'Thank you for your patience.',
                times: 'x',
                willUndergoMaintenance: 'The site will undergo maintenance between'
            },
            moveToProject: {
                chooseProject: 'Choose project',
                createNewProject: 'Create new project',
                connectToExisting: 'Connect file to existing OSF project',
                convertOrCopyMessage: {
                    component: 'Clicking "Move file" will immediately make changes to your OSF component and move your file.',
                    project: 'Clicking "Move file" will immediately make changes to your OSF project and move your file.'
                },
                couldNotCreateProject: 'Could not create project. Please try again.',
                couldNotMoveFile: 'Could not move file. Please try again',
                enterProjectTitle: 'Enter project title',
                fileSuccessfullyMoved: 'File was moved successfully!',
                goToComponent: 'Go to component',
                goToNewProject: 'Go to new project',
                goToProject: 'Go to project',
                keepWorkingHere: 'Keep working here',
                newProjectMessage: 'You have selected to create a new public project for your file. Users will still have access to your file unless the project becomes private.',
                noLongerPublicWarning: {
                    component: 'Files moved to private components will no longer be public or discoverable by others.',
                    project: 'Files moved to private projects will no longer be public or discoverable by others.'
                },
                noProjectsExistError: 'You have no available projects. Go back to create a new project.',
                projectSelectMessage: 'The list of projects appearing are projects and components for which you have write access. Registrations are not included here.'
            },
            oauthPopup: {
                login: 'Login'
            },
            osfCopyright: {
                centerForOpenScience: 'Center for Open Science',
                copyright: 'Copyright © 2011-',
                privacyPolicy: 'Privacy Policy',
                termsOfUse: 'Terms of Use'
            },
            paginationControl: {
                next: 'Next',
                of: 'of',
                page: 'Page',
                previous: 'Previous'
            },
            querySyntax: {
                allDatesIn: "all dates in",
                allFieldsSearched: "By default, all available fields are searched, but you can choose to search specific fields instead",
                allTagsBetween: "all tags between",
                and: "and",
                booleanDesc1: "By default, all terms in the query are optional, as long as one term matches. You can use boolean operators",
                booleanDesc2: "to have more control over the search",
                booleanDesc3: "The word",
                booleanDesc4: "be present. The words",
                booleanDesc5: "are optional but used for sorting by relevance",
                booleanDesc6: "Same as above, except the word",
                booleanDesc7: "be present",
                booleanDesc8: "Equivalent to",
                booleanDesc9: "The word",
                booleanDesc10: "The list of tags contains",
                booleanOperators: "Boolean Operators",
                boosting: "Boosting",
                boostingDesc1: "Use the boost operator",
                boostingDesc2: "with a number to make one term more relevant than another. The boost can be any positive number. Boosts between 0 and 1 reduce relevance.",
                boostingDesc3: "Boost results with",
                boostingDesc4: "higher than results with just",
                both: "both",
                butNot: "but not",
                couldNotPerformQuery: "Could not perform search query.",
                damerauLevenshteinDistanceDesc: "to match all words with at most 1 change. You can specify a different maximum edit distance with a number after the",
                descriptionContainsPhrase: "The description contains the exact phrase",
                documentation: "documentation",
                escapeReservedChars: " If you want to use any of these reserved characters in your query, escape them with a leading backslash. For instance, to search for ",
                except: "except",
                excluding: "excluding",
                fuzziness: "Fuzziness",
                fuzzinessDesc1: "after a word to indicate a 'fuzzy' search, to include matches that are similar but not exactly the same.",
                listContainsExactPhrase: "The list of contributor names contains the exact phrase",
                listOfIdentifiersContains: "The list of identifiers contains",
                match: "Match",
                matchWordStartsWith: "Match any word that starts with",
                moreInformation: "More Information",
                moreInformationOnSearch: "Please see below for more information on advanced search queries.",
                moreInfoQuerySyntax: "For more details about query syntax, see the",
                must: "must",
                mustNot: "must not",
                needToType: "you would need to type",
                or: "or",
                phraseProximity: "Phrase Proximity",
                phraseProximityDesc1: "You can also specify a maximum edit distance for phrases, to allow the words in the phrase to be farther apart or in a different order.",
                ranges: "Ranges",
                rangesDesc1: "Use brackets to specify ranges for a field. Square brackets",
                rangesDesc2: "indicate inclusive ranges and curly brackets",
                rangesDesc3: "indicate exclusive ranges",
                reservedChars: "Reserved Characters",
                searchByField: "Searching by Field",
                specialMeanings: "The following characters have special meanings in a query",
                theWord: "the word",
                thisUsesThe: "This uses the",
                titleContainsWord: "The title contains the word",
                use: "Use",
                wildcards: "Wildcards",
                wildcardsDesc1: "Use wildcards to match multiple terms at once. Use",
                wildcardsDesc2: "to match any single character, or",
                wildcardsDesc3: "to match zero or more characters."
            },
            searchFacetDaterange: {
                allTime: 'All time',
                modifyDate: 'Modify daterange'
            },
            searchFacetLanguage: {
                add: 'Add'
            },
            searchFacetSource: {
                source: 'Source',
                sources: 'Sources'
            },
            searchFacetWorktypeButton: {
                expandWorktype: 'Expand or contract worktype',
                removeWorktypeFilter: 'Remove worktype filter'
            },
            searchHelpModal: {
                close: 'Close',
                helpDescription: 'This gives you many options, but can be very simple as well. Examples of valid searches include:',
                searchHelp: 'Search help',
                searchSyntax: 'search syntax',
                searchUsesThe: 'Search uses the ',
                queries: 'Queries'
            },
            searchResult: {
                addedOn: 'Added on',
                lastEdited: 'Last edited',
                showResult: 'Expand search result',
                withdrawn: 'Withdrawn'
            },
            sharing: {
                twitter: 'Twitter',
                facebook: 'Facebook',
                linkedin: 'LinkedIn',
                email: 'Email'
            },
            totalShareResults: {
                searchableEvents: `{{count}} searchable events`,
                searchablePreprints: `{{count}} searchable {{preprintWords.preprints}}`,
                searchableRegistries: `{{count}} searchable registrations`
            }
        }
    }
};
