import {Injectable} from '@angular/core'
import {EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, takeUntil, tap, withLatestFrom} from 'rxjs'

import {Character, CharacterAbility, CharacterTrait} from '@core/db/model'
import {AppComponentStore} from '@core/ngrx'
import {filterNotEmpty, filterNotNull} from '@core/rxjs'
import {objectOmit} from '@core/util/objects'
import {strSort} from '@core/util/sorters'

export type StoreCharacter = NullableProperties<Omit<Character, 'personality' | 'abilities'>>
export type FormCharacter = NullableProperties<Omit<Character, '_id' | '_rev' | 'modelType'>>

interface EditCharacterStoreState extends StoreCharacter {
    personality: EntityState<CharacterTrait>
    abilities: EntityState<CharacterAbility>
}

export interface EditCharacterStoreData extends StoreCharacter {
    personality: CharacterTrait[]
    abilities: CharacterAbility[]
}

@Injectable()
export class EditCharacterStore extends AppComponentStore<EditCharacterStoreState> {

    private readonly traitAdapter = this.createCustomIdEntityAdapter<CharacterTrait>(e => e.label, strSort(e => e.label))
    private readonly traitSelectors = this.traitAdapter.getSelectors()

    private readonly abilityAdapter = this.createCustomIdEntityAdapter<CharacterAbility>(e => e.label, strSort(e => e.label))
    private readonly abilitySelectors = this.abilityAdapter.getSelectors()

    public readonly characterId$: Observable<string | null> = this.select(s => s._id)
    public readonly characterRev$: Observable<string | null> = this.select(s => s._rev)
    public readonly characterIsNew$: Observable<boolean> = this.characterId$.pipe(map(id => !id))

    public readonly age$: Observable<number> = this
        .select(s => s.age)
        .pipe(filterNotNull())
    public readonly bio$: Observable<string> = this
        .select(s => s.bio)
        .pipe(filterNotNull(), filterNotEmpty())
    public readonly combatClass$: Observable<string> = this
        .select(s => s.combatClass)
        .pipe(filterNotNull(), filterNotEmpty())
    public readonly name$: Observable<string> = this
        .select(s => s.name)
        .pipe(filterNotNull(), filterNotEmpty())
    public readonly species$: Observable<string> = this
        .select(s => s.species)
        .pipe(filterNotNull(), filterNotEmpty())

    public readonly character$: Observable<StoreCharacter> = this
        .select(s => objectOmit(s, 'personality', 'abilities'))

    public readonly personalityTraits$: Observable<CharacterTrait[]> = this
        .select(s => s.personality)
        .pipe(map(this.traitSelectors.selectAll))

    public readonly abilities$: Observable<CharacterAbility[]> = this
        .select(s => s.abilities)
        .pipe(map(this.abilitySelectors.selectAll))

    constructor() {
        super()

        this.setState({
            _id: null,
            _rev: null,
            age: null,
            bio: null,
            combatClass: null,
            modelType: 'CHARACTER',
            name: null,
            species: null,
            personality: this.traitAdapter.getInitialState(),
            abilities: this.abilityAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    public readonly save: (patch: FormCharacter) => void = this.effect<FormCharacter>($ => $.pipe(
        withLatestFrom(this.characterId$, this.characterRev$),
        map(([patch, _id, _rev]) =>
            ({...patch, _id, _rev, modelType: 'CHARACTER'}) as Character),
        mergeMap(patch => this.db.save(patch)),
        tap(character => this.setStoreData(character)))
    )

    private setStoreData({personality, abilities, ...rest}: EditCharacterStoreData) {
        this.patchState(s => ({
            ...rest,
            personality: this.traitAdapter.setAll(personality, s.personality),
            abilities: this.abilityAdapter.setAll(abilities, s.abilities)
        }))
    }
}
