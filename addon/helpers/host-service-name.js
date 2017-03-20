import Ember from 'ember';
import hostServiceName from '../utils/host-service-name';

/**
 Use the `host-service-name` utility function to retrieve the host application name.
 Usage example:
 ```handlebars
 This is text we want to do: {{host-service-name}}
 ```
 @class host-service-name-helper
 @uses host-service-name
 */

export function hostServiceNameHelper() {
    return hostServiceName();
}

export default Ember.Helper.helper(hostServiceNameHelper);
