import {Injectable} from '@angular/core'
import {EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, takeUntil, tap} from 'rxjs'

import {Character} from '@core/db/model'
import {AppComponentStore} from '@core/ngrx'
import {strSort} from '@core/util/sorters'

import {charactersOverviewResolver} from './characters-overview.resolver'

interface CharactersOverviewStoreState {
    characters: EntityState<Character>
}

export interface CharactersOverviewStoreData {
    characters: Character[]
}

@Injectable()
export class CharactersOverviewStore extends AppComponentStore<CharactersOverviewStoreState> {

    private readonly characterAdapter = this.createEntityAdapter<Character>(strSort(e => e.name))
    private readonly characterSelectors = this.characterAdapter.getSelectors()

    public readonly characters$: Observable<Character[]> = this
        .select(s => s.characters)
        .pipe(map(this.characterSelectors.selectAll))

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
