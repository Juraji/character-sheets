import {Injectable} from '@angular/core'
import {EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, takeUntil, tap, withLatestFrom} from 'rxjs'

import {AppComponentStore, AppEntityAdapter} from '@core/ngrx'
import {filterNotEmpty, filterNotNull, firstNotNull} from '@core/rxjs'
import {objectOmit, objectOmitNulls} from '@core/util/objects'
import {strSort} from '@core/util/sorters'
import {Attachment, Character, CharacterAbility, Model, ModelType} from '@db/model';
import {CharacterService, SettingsService} from '@db/query';

export type StoreCharacter = Omit<Character, keyof Model | 'abilities'>
export type FormCharacter = Omit<Character, keyof Model>

interface EditCharacterStoreState {
    id: Optional<string>,
    rev: Optional<string>,
    readonly modelType: ModelType,
    character: Optional<StoreCharacter>
    sheetImage: Optional<Attachment>,
    abilities: EntityState<CharacterAbility>
}

export interface EditCharacterStoreData {
    character: Nullable<Character, keyof Model>
    sheetImage: Optional<Attachment>
}

@Injectable()
export class EditCharacterStore extends AppComponentStore<EditCharacterStoreState> {

    private readonly abilityAdapter: AppEntityAdapter<CharacterAbility> = this.createEntityAdapter(e => e.label, strSort(e => e.label))

    public readonly characterId$: Observable<Optional<string>> = this.select(s => s.id)
    public readonly characterRev$: Observable<Optional<string>> = this.select(s => s.rev)
    public readonly characterIsNew$: Observable<boolean> = this.characterId$.pipe(map(id => !id))

    public readonly character$: Observable<StoreCharacter> = this
        .select(s => s.character)
        .pipe(filterNotNull())

    public readonly age$: Observable<Optional<number>> = this.character$
        .pipe(map(s => s.age))
    public readonly bio$: Observable<string> = this.character$
        .pipe(map(s => s.bio), filterNotEmpty())
    public readonly combatClass$: Observable<string> = this.character$
        .pipe(map(s => s.combatClass), filterNotEmpty())
    public readonly name$: Observable<string> = this.character$
        .pipe(map(s => s.name), filterNotEmpty())
    public readonly species$: Observable<string> = this.character$
        .pipe(map(s => s.species), filterNotEmpty())

    public readonly sheetImage$: Observable<Optional<Attachment>> = this
        .select(s => s.sheetImage)

    public readonly abilities$: Observable<CharacterAbility[]> = this
        .select(s => s.abilities)
        .pipe(this.abilityAdapter.selectAll)
    public readonly combatClassNames$: Observable<string[]> = this.settings.getSetting('combatClassNames')
    public readonly speciesNames$: Observable<string[]> = this.settings.getSetting('speciesNames')

    constructor(
        private readonly characters: CharacterService,
        private readonly settings: SettingsService
    ) {
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
                ({...existing, ...objectOmitNulls(character), _id, _rev}) as Character),
            mergeMap(patch => this.characters.save(patch)),
            tap(c => this.patchCharacter(c))
        )
    }

    public delete() {
        return this.characterId$
            .pipe(
                firstNotNull(),
                withLatestFrom(this.characterRev$.pipe(filterNotNull())),
                mergeMap(([id, rev]) => this.characters.delete(id, rev)),
                tap(() => this.patchState({id: null, rev: null}))
            )
    }

    public readonly updateSheetImage: (f: Blob) => void = this.effect<Blob>($ => $.pipe(
        withLatestFrom(this.characterId$.pipe(filterNotNull()), this.characterRev$.pipe(filterNotNull())),
        mergeMap(([f, docId, rev]) => this.characters.setSheetImage(docId, rev, f)),
        tap(({_id, _rev, attachment}) => this
            .patchState({id: _id, rev: _rev, sheetImage: attachment})),
    ))

    public readonly removeSheetImage: () => void = this.effect<void>($ => $.pipe(
        withLatestFrom(this.characterId$.pipe(filterNotNull()), this.characterRev$.pipe(filterNotNull())),
        mergeMap(([_, docId, rev]) => this.characters.deleteSheetImage(docId, rev)),
        tap(model => this.patchState({...model, sheetImage: null}))
    ))

    private setStoreData(sd: EditCharacterStoreData) {
        this.patchCharacter(sd.character)
        this.patchState({sheetImage: sd.sheetImage})
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
