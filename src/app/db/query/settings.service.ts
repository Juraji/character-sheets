import {Injectable} from '@angular/core';
import {defaultIfEmpty, defer, map, mergeMap, Observable} from 'rxjs';

import {filterNotEmpty, filterNotNull} from '@core/rxjs';
import {Settings} from '@db/model';

import {DatabaseService} from './database-service';

const DEFAULT_SETTINGS: Settings = {
    _id: 'SETTINGS',
    _rev: '',
    modelType: 'SETTINGS',

    combatClassNames: [
        'Artificer', 'Barbarian', 'Bard', 'Blood Hunter', 'Cleric', 'Druid', 'Fighter',
        'Monk', 'Paladin', 'Ranger', 'Rogue', 'Scout', 'Sorcerer', 'Warlock', 'Wizard',
    ],
    speciesNames: ['Elf', 'Halfling', 'Human', 'Orc', 'Undead']
}

@Injectable()
export class SettingsService extends DatabaseService<Settings, Settings> {
    constructor() {
        super('SETTINGS');
    }

    public getSetting<K extends keyof Settings, V extends Settings[K]>(key: K): Observable<V> {
        const findRequest: PouchDB.Find.FindRequest<Settings> = {
            selector: {_id: this.modelType, modelType: this.modelType},
            fields: [key]
        }

        // noinspection JSVoidFunctionReturnValueUsed
        return defer(() => this.pouchDb.find(findRequest) as Promise<PouchDB.Find.FindResponse<Settings>>)
            .pipe(
                map(res => res.docs),
                filterNotEmpty(),
                map(docs => docs[0][key] as V),
                filterNotNull(),
                defaultIfEmpty(DEFAULT_SETTINGS[key] as V)
            )
    }

    public setSetting<K extends keyof Settings, V extends Settings[K]>(key: K, value: V): Observable<V> {
        return defer(() => this.pouchDb.get<Settings>(this.modelType)).pipe(
            this.catchNotFound(DEFAULT_SETTINGS),
            map(it => ({...it, [key]: value})),
            mergeMap(update => update._rev === ''
                ? this.pouchDb.post(update)
                : this.pouchDb.put(update)),
            map(() => value)
        )
    }
}
