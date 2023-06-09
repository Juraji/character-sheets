import {Model} from './core';

export interface Settings extends Model {
    modelType: 'SETTINGS',
    combatClassNames: string[]
    speciesNames: string[]
}
