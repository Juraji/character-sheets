import {Injectable} from '@angular/core';
import {map, mergeMap, Observable} from 'rxjs';

import {Settings} from '@db/model';

import {DatabaseService} from './database-service';

@Injectable()
export class SettingsService extends DatabaseService<Settings, Settings> {
    constructor() {
        super('SETTINGS');
    }

    public getSetting<K extends keyof Settings, V extends Settings[K]>(key: K): Observable<V> {
        return this.getSettings().pipe(map(it => it[key])) as Observable<V>
    }

    public setSetting<K extends keyof Settings, V extends Settings[K]>(key: K, value: V): Observable<V> {
        return this.getSettings().pipe(
            map(it => ({...it, [key]: value})),
            mergeMap(it => this.save(it)),
            map(it => it[key])
        ) as Observable<V>
    }

    private getSettings(): Observable<Settings> {
        return this
            .findAll()
            .pipe(map(it => (it.pop() || {} as Settings)))
    }
}
