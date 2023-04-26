import {Injectable} from '@angular/core'
import {EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, takeUntil, tap} from 'rxjs'

import {CharacterListView} from '@core/db/model'
import {AppComponentStore, AppEntityAdapter} from '@core/ngrx'
import {strSort} from '@core/util/sorters'

import {charactersOverviewResolver} from './characters-overview.resolver'

interface CharactersOverviewStoreState {
    characters: EntityState<CharacterListView>
}

export interface CharactersOverviewStoreData {
    characters: CharacterListView[]
}

@Injectable()
export class CharactersOverviewStore extends AppComponentStore<CharactersOverviewStoreState> {

    private readonly characterAdapter: AppEntityAdapter<CharacterListView> = this.createEntityAdapter(e => e._id, strSort(e => e.name))

    public readonly characters$: Observable<CharacterListView[]> = this
        .select(s => s.characters)
        .pipe(this.characterAdapter.selectAll)

    constructor() {
        super()

        this.setState({
            characters: this.characterAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    private setStoreData(sd: CharactersOverviewStoreData) {
        this.patchState(s => ({
            characters: this.characterAdapter.setAll(sd.characters, s.characters)
        }))
    }

    public refresh: () => void = this.effect($ => $.pipe(
        mergeMap(() => this.runResolve(charactersOverviewResolver)),
        tap(sd => this.setStoreData(sd))
    ))
}
