YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Analytics",
        "CasAuthenticatedRouteMixin",
        "Citation",
        "Collection",
        "Comment",
        "CommentReport",
        "CommentableMixin",
        "Contributor",
        "DraftRegistration",
        "FetchAllRouteMixin",
        "File",
        "FileCacheBypassMixin",
        "FileItemMixin",
        "FileProvider",
        "FileVersion",
        "GenericDataADapter",
        "InfinityCustomMixin",
        "Institution",
        "Log",
        "Metaschema",
        "Node",
        "NodeActionsMixin",
        "NodeLink",
        "OsfAdapter",
        "OsfAgnosticAuthController",
        "OsfAgnosticAuthRoute",
        "OsfCookieAuthenticator",
        "OsfCookieAuthorizer",
        "OsfCookieLoginController",
        "OsfCookieLoginRoute",
        "OsfModel",
        "OsfSerializer",
        "OsfTokenAuthenticator",
        "OsfTokenAuthorizer",
        "OsfTokenLoginControllerMixin",
        "OsfTokenLoginRouteMixin",
        "PaginatedControllerMixin",
        "PaginatedRouteMixin",
        "Preprint",
        "Registration",
        "RegistrationActionsMixin",
        "TaggableMixin",
        "Taxonomy",
        "User",
        "ajax-helpers",
        "auth",
        "citation-widget",
        "comment-detail",
        "comment-form",
        "comment-pane",
        "current-user",
        "dropzone-widget",
        "elem-id",
        "eosf-project-nav",
        "file-browser",
        "file-browser-icon",
        "file-chooser component",
        "file-manager",
        "file-renderer",
        "file-version",
        "file-widget",
        "fix-special-char",
        "fix-special-char-helper",
        "fixstring",
        "navbar-auth-dropdown",
        "oauth-popup",
        "osf-copyright",
        "osf-footer",
        "osf-mode-footer",
        "osf-navbar",
        "osf-paginator",
        "pagination-control",
        "permissions",
        "search-dropdown",
        "sign-up",
        "tags-widget"
    ],
    "modules": [
        "adapters",
        "authenticators",
        "authorizers",
        "components",
        "const",
        "ember",
        "ember-osf",
        "ember-preprints",
        "helpers",
        "mixins",
        "models",
        "serializers",
        "services",
        "transforms",
        "utils"
    ],
    "allModules": [
        {
            "displayName": "adapters",
            "name": "adapters",
            "description": "Base adapter class for all OSF APIv2 endpoints"
        },
        {
            "displayName": "authenticators",
            "name": "authenticators",
            "description": "Ember-simple-auth compatible authenticator based on session cookie.\n\nIntended to be used with the authorizer of the same name."
        },
        {
            "displayName": "authorizers",
            "name": "authorizers",
            "description": "Ember-simple-auth compatible authorizer based on session cookie.\n\nIntended to be used with the authenticator of the same name."
        },
        {
            "displayName": "components",
            "name": "components",
            "description": "Lists citations for node in APA, MLA, and Chicago formats"
        },
        {
            "displayName": "const",
            "name": "const"
        },
        {
            "displayName": "ember",
            "name": "ember"
        },
        {
            "displayName": "ember-osf",
            "name": "ember-osf",
            "description": "Helper functions for asynchronous behavior"
        },
        {
            "displayName": "ember-preprints",
            "name": "ember-preprints"
        },
        {
            "displayName": "helpers",
            "name": "helpers",
            "description": "Generate a unique HTML element ID for this element. Given \"someid\" for component instance 123, returns \"ember123-someid\"\n\nUseful to ensure unique IDs, eg for when component is reused in page."
        },
        {
            "displayName": "mixins",
            "name": "mixins",
            "description": "Analytics mixin. Provides actions that can be used in templates to track events (can send to multiple\nanalytics services)"
        },
        {
            "displayName": "models",
            "name": "models",
            "description": "Model for OSF APIv2 citation styles"
        },
        {
            "displayName": "serializers",
            "name": "serializers",
            "description": "Base serializer class for all OSF APIv2 endpoints. Provides custom behaviors for embeds, relationships, and pagination."
        },
        {
            "displayName": "services",
            "name": "services",
            "description": "Access information about the currently logged in user"
        },
        {
            "displayName": "transforms",
            "name": "transforms",
            "description": "Custom string field transform that uses the `fix-special-char` utility function to clean up malformed text sent\nfrom the server. This allows string fields to be correctly and transparently used in templates without manually fixing\nthese characters for display on each use.\n\n This transform is used when `fixstring` is passed as the type parameter to the DS.attr function.\n  ```app/models/score.js\n   import DS from 'ember-data';\n   export default DS.Model.extend({\n      astring: DS.attr('fixstring'),\n   });\n ```"
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "Helper functions for asynchronous behavior"
        }
    ],
    "elements": []
} };
});