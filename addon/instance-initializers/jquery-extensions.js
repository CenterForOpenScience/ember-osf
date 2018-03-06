import { checkInView } from '../utils/jquery-checkinview';

export function initialize() {
    // Add jQuery extension calls here
    checkInView();
}

export default {
    name: 'jq-extensions',
    initialize: initialize
};
