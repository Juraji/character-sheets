import {Injectable} from '@angular/core'
import {EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, pairwise, startWith, takeUntil, tap, withLatestFrom} from 'rxjs'

import {Character, CharacterAbility, CharacterTrait, ModelType, SHEET_IMAGE_ATTACHMENT} from '@core/db/model'
import {AppComponentStore} from '@core/ngrx'
import {filterNotEmpty, filterNotNull, firstNotNull} from '@core/rxjs'
import {objectOmit} from '@core/util/objects'
import {strSort} from '@core/util/sorters'

export type StoreCharacter = NullableProperties<Omit<Character, 'personality' | 'abilities'>>
export type FormCharacter = NullableProperties<Omit<Character, '_id' | '_rev' | 'modelType'>>

interface EditCharacterStoreState extends StoreCharacter {
    sheetImage: Nullable<Blob>,
    personality: EntityState<CharacterTrait>
    abilities: EntityState<CharacterAbility>
}

export interface EditCharacterStoreData extends StoreCharacter {
    sheetImage: Nullable<Blob>
    personality: CharacterTrait[]
    abilities: CharacterAbility[]
}

@Injectable()
export class EditCharacterStore extends AppComponentStore<EditCharacterStoreState> {

    private readonly traitAdapter = this.createCustomIdEntityAdapter<CharacterTrait>(e => e.label, strSort(e => e.label))
    private readonly traitSelectors = this.traitAdapter.getSelectors()

    private readonly abilityAdapter = this.createCustomIdEntityAdapter<CharacterAbility>(e => e.label, strSort(e => e.label))
    private readonly abilitySelectors = this.abilityAdapter.getSelectors()

    public readonly characterId$: Observable<Nullable<string>> = this.select(s => s._id)
    public readonly characterRev$: Observable<Nullable<string>> = this.select(s => s._rev)
    public readonly characterIsNew$: Observable<boolean> = this.characterId$.pipe(map(id => !id))
    public readonly modelType$: Observable<Nullable<ModelType>> = this.select(s => s.modelType)

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

    public readonly sheetImage$: Observable<Nullable<Blob>> = this.select(s => s.sheetImage)
    public readonly sheetImageObjUrl$: Observable<string> = this.sheetImage$
        .pipe(
            filterNotNull(),
            map(b => URL.createObjectURL(b)),
            startWith(''),
            pairwise(),
            tap(([prev]) => URL.revokeObjectURL(prev)),
            map(([_, next]) => next)
        )

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
            sheetImage: null,
            personality: this.traitAdapter.getInitialState(),
            abilities: this.abilityAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    public save(patch: FormCharacter) {
        return this.characterId$.pipe(
            withLatestFrom(this.characterRev$),
            map(([_id, _rev]) =>
                ({...patch, _id, _rev, modelType: 'CHARACTER'}) as Character),
            mergeMap(patch => this.db.save(patch)),
            tap(({personality, abilities, ...rest}) => this.patchState(s => ({
                ...rest,
                personality: this.traitAdapter.setAll(personality, s.personality),
                abilities: this.traitAdapter.setAll(abilities, s.abilities)
            })))
        )
    }

    public readonly updateSheetImage: (f: Blob) => void = this.effect<Blob>($ => $.pipe(
        withLatestFrom(this.characterId$.pipe(filterNotNull()), this.characterRev$.pipe(filterNotNull())),
        mergeMap(([f, docId, rev]) => this.db.putAttachment(docId, rev, SHEET_IMAGE_ATTACHMENT, f.type, f)),
        tap(({_id, _rev, content}) => this.patchState({_id, _rev, sheetImage: content})),
    ))

    public readonly removeSheetImage: () => void = this.effect<void>($ => $.pipe(
        withLatestFrom(this.characterId$.pipe(filterNotNull()), this.characterRev$.pipe(filterNotNull())),
        mergeMap(([_, docId, rev]) => this.db.removeAttachment(docId, rev, SHEET_IMAGE_ATTACHMENT)),
        tap(model => this.patchState({...model, sheetImage: null}))
    ))

    public delete() {
        return this.characterId$
            .pipe(
                firstNotNull(),
                withLatestFrom(this.characterRev$.pipe(filterNotNull()), this.modelType$.pipe(filterNotNull())),
                mergeMap(([_id, _rev, modelType]) =>
                    this.db.delete({_id, _rev, modelType})),
                tap(() => this.patchState({_id: null, _rev: null}))
            )
    }

    private setStoreData({personality, abilities, ...rest}: EditCharacterStoreData) {
        this.patchState(s => ({
            ...rest,
            personality: this.traitAdapter.setAll(personality, s.personality),
            abilities: this.abilityAdapter.setAll(abilities, s.abilities)
        }))
    }
}
