import {Injectable} from '@angular/core'
import {EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, pairwise, startWith, takeUntil, tap, withLatestFrom} from 'rxjs'

import {Character, CharacterAbility, Model, ModelType, SHEET_IMAGE_ATTACHMENT_ID} from '@core/db/model'
import {AppComponentStore} from '@core/ngrx'
import {filterNotEmpty, filterNotNull, firstNotNull} from '@core/rxjs'
import {objectOmit, objectOmitNulls} from '@core/util/objects'
import {strSort} from '@core/util/sorters'

export type StoreCharacter = Omit<Character, keyof Model | 'abilities'>
export type FormCharacter = Omit<Character, keyof Model>

interface EditCharacterStoreState {
    id: Optional<string>,
    rev: Optional<string>,
    readonly modelType: ModelType,
    character: Optional<StoreCharacter>
    sheetImage: Optional<Blob>,
    abilities: EntityState<CharacterAbility>
}

export interface EditCharacterStoreData {
    character: Nullable<Character, keyof Model>
    sheetImage: Optional<Blob>
}

@Injectable()
export class EditCharacterStore extends AppComponentStore<EditCharacterStoreState> {

    private readonly abilityAdapter = this.createCustomIdEntityAdapter<CharacterAbility>(e => e.label, strSort(e => e.label))
    private readonly abilitySelectors = this.abilityAdapter.getSelectors()

    public readonly characterId$: Observable<Optional<string>> = this.select(s => s.id)
    public readonly characterRev$: Observable<Optional<string>> = this.select(s => s.rev)
    public readonly characterIsNew$: Observable<boolean> = this.characterId$.pipe(map(id => !id))
    public readonly modelType$: Observable<ModelType> = this.select(s => s.modelType)

    public readonly character$: Observable<StoreCharacter> = this
        .select(s => s.character)
        .pipe(filterNotNull())

    public readonly age$: Observable<number> = this.character$
        .pipe(map(s => s.age))
    public readonly bio$: Observable<string> = this.character$
        .pipe(map(s => s.bio), filterNotEmpty())
    public readonly combatClass$: Observable<string> = this.character$
        .pipe(map(s => s.combatClass), filterNotEmpty())
    public readonly name$: Observable<string> = this.character$
        .pipe(map(s => s.name), filterNotEmpty())
    public readonly species$: Observable<string> = this.character$
        .pipe(map(s => s.species), filterNotEmpty())

    public readonly sheetImage$: Observable<Optional<Blob>> = this.select(s => s.sheetImage)
    public readonly sheetImageObjUrl$: Observable<string> = this.sheetImage$
        .pipe(
            filterNotNull(),
            map(b => URL.createObjectURL(b)),
            startWith(''),
            pairwise(),
            tap(([prev]) => URL.revokeObjectURL(prev)),
            map(([_, next]) => next)
        )

    public readonly abilities$: Observable<CharacterAbility[]> = this
        .select(s => s.abilities)
        .pipe(map(this.abilitySelectors.selectAll))

    constructor() {
        super()

        this.setState({
            id: null,
            rev: null,
            modelType: 'CHARACTER',
            character: null,
            sheetImage: null,
            abilities: this.abilityAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    public save(character: Nullable<FormCharacter>) {
        return this.characterId$.pipe(
            withLatestFrom(this.characterRev$, this.character$),
            map(([_id, _rev, existing]) =>
                ({...existing, ...objectOmitNulls(character), _id, _rev, modelType: 'CHARACTER'}) as Character),
            mergeMap(patch => this.db.save(patch)),
            tap(c => this.patchCharacter(c))
        )
    }

    public delete() {
        return this.characterId$
            .pipe(
                firstNotNull(),
                withLatestFrom(this.characterRev$.pipe(filterNotNull()), this.modelType$.pipe(filterNotNull())),
                mergeMap(([_id, _rev, modelType]) =>
                    this.db.delete({_id, _rev, modelType})),
                tap(() => this.patchState({id: null, rev: null}))
            )
    }

    public readonly updateSheetImage: (f: Blob) => void = this.effect<Blob>($ => $.pipe(
        withLatestFrom(this.characterId$.pipe(filterNotNull()), this.characterRev$.pipe(filterNotNull())),
        mergeMap(([f, docId, rev]) => this.db.putAttachment(docId, rev, SHEET_IMAGE_ATTACHMENT_ID, f.type, f)),
        tap(({_id, _rev, content}) => this.patchState({id: _id, rev: _rev, sheetImage: content})),
    ))

    public readonly removeSheetImage: () => void = this.effect<void>($ => $.pipe(
        withLatestFrom(this.characterId$.pipe(filterNotNull()), this.characterRev$.pipe(filterNotNull())),
        mergeMap(([_, docId, rev]) => this.db.removeAttachment(docId, rev, SHEET_IMAGE_ATTACHMENT_ID)),
        tap(model => this.patchState({...model, sheetImage: null}))
    ))

    private setStoreData(sd: EditCharacterStoreData) {
        this.patchCharacter(sd.character)
        this.patchState({sheetImage: sd.sheetImage,})
    }

    private patchCharacter(character: Nullable<Character, keyof Model>) {
        const {
            _id,
            _rev,
            abilities,
            ...c
        } = character

        this.patchState(s => ({
            id: _id,
            rev: _rev,
            character: objectOmit(c, 'modelType'),
            abilities: this.abilityAdapter.setAll(abilities, s.abilities)
        }))
    }
}
