import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {forkJoin} from 'rxjs';

import {ForkJoinSource} from '@core/rxjs';
import {SettingsService} from '@db/query';

import {SettingsStoreData} from './settings.store';


export const settingsResolver: ResolveFn<SettingsStoreData> = () => {
    const settings = inject(SettingsService)

    const sources: ForkJoinSource<SettingsStoreData> = {
        combatClassNames: settings.getSetting('combatClassNames'),
        speciesNames: settings.getSetting('speciesNames')
    }

    return forkJoin(sources)
}
