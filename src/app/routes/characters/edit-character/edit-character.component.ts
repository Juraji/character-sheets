import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'
import {map, Observable, startWith} from 'rxjs'

import {CardComponent} from '@components/card'
import {NotPipe} from '@components/pipes'
import {ReadOnlyFieldComponent} from '@components/read-only-field/read-only-field.component'
import {Character, ModelFormOf} from '@core/db/model'
import {ModelFormGroup} from '@core/forms'
import {filterNotEmpty, filterNotNull, takeUntilDestroyed} from '@core/rxjs'
import {BoolBehaviourSubject} from '@core/rxjs/bool-behaviour-subject'

import {EditCharacterStore} from './edit-character.store'

const DEFAULT_COMBAT_CLASSES: string[] = [
    'Artificer', 'Barbarian', 'Bard', 'Blood Hunter', 'Cleric', 'Druid', 'Fighter',
    'Monk', 'Paladin', 'Ranger', 'Rogue', 'Scout', 'Sorcerer', 'Warlock', 'Wizard',
]

const DEFAULT_SPECIES: string[] = [
    'Elf', 'Halfling', 'Human', 'Orc', 'Undead'
]

@Component({
    selector: 'app-edit-character',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CardComponent, NotPipe, BsDropdownModule, ReadOnlyFieldComponent],
    providers: [EditCharacterStore],
    templateUrl: './edit-character.component.html',
    styleUrls: ['./edit-character.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCharacterComponent implements OnInit, OnDestroy {

    public readonly editorActive$ = new BoolBehaviourSubject()

    public readonly defaultCombatClasses = DEFAULT_COMBAT_CLASSES
    public readonly defaultSpecies = DEFAULT_SPECIES

    public readonly pageTitle$: Observable<string> = this.store.character$.pipe(
        map(c => `Character: ${c.name}`),
        filterNotEmpty(),
        startWith('New Character')
    )

    public readonly formGroup = new ModelFormGroup<ModelFormOf<Character>>({
        name: new FormControl('', [Validators.required]),
        bio: new FormControl(''),
        age: new FormControl(100, [Validators.required, Validators.min(1)]),
        species: new FormControl('', [Validators.required]),
        combatClass: new FormControl('', [Validators.required]),
        personality: new FormArray([]),
        abilities: new FormArray([])
    })

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        public readonly store: EditCharacterStore
    ) {
    }

    public ngOnInit() {
        this.store.character$
            .pipe(takeUntilDestroyed(this))
            .subscribe(c => this.formGroup.patchValue(c))

        this.store.characterIsNew$
            .pipe(takeUntilDestroyed(this))
            .subscribe(isNew => this.editorActive$.next(isNew))

        this.store.characterId$
            .pipe(takeUntilDestroyed(this), filterNotNull())
            .subscribe(id => this.router.navigate(['..', id], {relativeTo: this.activatedRoute}))
    }

    public ngOnDestroy() {
    }

    public onUseSpecies(species: string, append = false) {
        const control = this.formGroup.get('species')
        if (!!control) {
            if (append && !!control.value) control.setValue(`${control.value}, ${species}`)
            else control.setValue(species)
        }
    }

    public onUseCombatClass(combatClass: string, append = false) {
        const control = this.formGroup.get('combatClass')
        if (!!control) {
            if (append && !!control.value) control.setValue(`${control.value}, ${combatClass}`)
            else control.setValue(combatClass)
        }
    }

    public onFormSubmit() {
        if (this.formGroup.invalid) return
        const patch = this.formGroup.value
        this.editorActive$.disable()

        this.store.save(patch)
    }
}
