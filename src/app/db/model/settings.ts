import {Model} from './core';

export interface Settings extends Model {
    modelType: 'SETTINGS',
    couchDbUri: Optional<string>
}
