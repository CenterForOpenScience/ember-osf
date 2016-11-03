var ADMIN = 'admin';
var READ = 'read';
var WRITE = 'write';

/**
 * Provide human-readable labels for permissions fields. Useful in dropdown UI.
 * @property permissionSelector
 * @final
 * @type {*[]}
 */
// TODO: Document constants in YUIDoc format
let permissionSelector = [
    { value: READ, text: 'Read' },
    { value: WRITE, text: 'Read + Write' },
    { value: ADMIN, text: 'Administrator' }
];

export default {
    ADMIN: ADMIN,
    READ: READ,
    WRITE: WRITE,
    PERMISSIONS: [READ, WRITE, ADMIN],
    CREATOR_PERMISSIONS: [READ, WRITE, ADMIN],
    DEFAULT_CONTRIBUTOR_PERMISSIONS: [READ, WRITE]
};

export {permissionSelector};
