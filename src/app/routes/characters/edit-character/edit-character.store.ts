import {Injectable} from '@angular/core'
import {EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, takeUntil, tap, withLatestFrom} from 'rxjs'

import {Character, CharacterAbility, CharacterTrait, ModelFormOf} from '@core/db/model'
import {AppComponentStore} from '@core/ngrx'
import {filterNotNull} from '@core/rxjs'
import {strSort} from '@core/util/sorters'

interface EditCharacterStoreState {
    character: Character | null,
    personality: EntityState<CharacterTrait>
    abilities: EntityState<CharacterAbility>
}

export interface EditCharacterStoreData {
    character: Character
}

@Injectable()
export class EditCharacterStore extends AppComponentStore<EditCharacterStoreState> {

    private readonly traitAdapter = this.createCustomIdEntityAdapter<CharacterTrait>(e => e.label, strSort(e => e.label))
    private readonly traitSelectors = this.traitAdapter.getSelectors()

    private readonly abilityAdapter = this.createCustomIdEntityAdapter<CharacterAbility>(e => e.label, strSort(e => e.label))
    private readonly abilitySelectors = this.abilityAdapter.getSelectors()

    public readonly characterId$: Observable<string | undefined> = this.select(s => s.character?._id)
    public readonly characterIsNew$: Observable<boolean> = this.characterId$.pipe(map(id => !id))
    public readonly character$: Observable<Character> = this.select(s => s.character).pipe(filterNotNull())

    public readonly personalityTraits$: Observable<CharacterTrait[]> = this
        .select(s => s.personality)
        .pipe(map(this.traitSelectors.selectAll))

    public readonly abilities$: Observable<CharacterAbility[]> = this
        .select(s => s.abilities)
        .pipe(map(this.abilitySelectors.selectAll))

    constructor() {
        super()

        this.setState({
            character: null,
            personality: this.traitAdapter.getInitialState(),
            abilities: this.abilityAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    public readonly save: (patch: ModelFormOf<Character>) => void = this.effect<ModelFormOf<Character>>($ => $.pipe(
        withLatestFrom(this.character$),
        map(([patch, character]) => ({...character, ...patch}) as Character),
        mergeMap(patch => this.db.save(patch)),
        tap(res => this.patchState(s => ({
            character: res,
            personality: this.traitAdapter.setAll(res.personality, s.personality),
            abilities: this.abilityAdapter.setAll(res.abilities, s.abilities)
        })))
    ))

    private setStoreData(sd: EditCharacterStoreData) {
        this.patchState(s => ({
            character: sd.character,
            personality: this.traitAdapter.setAll(sd.character.personality, s.personality),
            abilities: this.abilityAdapter.setAll(sd.character.abilities, s.abilities)
        }))
    }
}
