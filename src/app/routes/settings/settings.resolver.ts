import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {first, forkJoin} from 'rxjs';

import {ForkJoinSource} from '@core/rxjs';
import {DbReplicationService, SettingsService} from '@db/query';

import {SettingsStoreData} from './settings.store';


export const settingsResolver: ResolveFn<SettingsStoreData> = () => {
    const replService = inject(DbReplicationService)
    const settings = inject(SettingsService)

    const sources: ForkJoinSource<SettingsStoreData> = {
        couchDbSyncUri: replService.remoteCouchDbUri$.pipe(first()),
        combatClassNames: settings.getSetting('combatClassNames'),
        speciesNames: settings.getSetting('speciesNames')

    }

    return forkJoin(sources)
}
