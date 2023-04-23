import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'
import {map, mergeMap, tap} from 'rxjs'

import {CardComponent} from '@components/card'
import {ArrayIndexSeqPipe, NotPipe} from '@components/pipes'
import {ReadOnlyFieldComponent} from '@components/read-only-field/read-only-field.component'
import {TwoFactorButtonComponent} from '@components/two-factor-button/two-factor-button.component'
import {CharacterAbility, CharacterTrait} from '@core/db/model'
import {ModelFormGroup} from '@core/forms'
import {takeUntilDestroyed} from '@core/rxjs'
import {BoolBehaviourSubject} from '@core/rxjs/bool-behaviour-subject'

import {EditCharacterStore, FormCharacter} from './edit-character.store'

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
    imports: [CommonModule, ReactiveFormsModule, CardComponent, NotPipe, BsDropdownModule, ReadOnlyFieldComponent, ArrayIndexSeqPipe, NgOptimizedImage, TwoFactorButtonComponent],
    providers: [EditCharacterStore],
    templateUrl: './edit-character.component.html',
    styleUrls: ['./edit-character.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCharacterComponent implements OnInit, OnDestroy {

    public readonly editorActive$ = new BoolBehaviourSubject()

    public readonly defaultCombatClasses = DEFAULT_COMBAT_CLASSES
    public readonly defaultSpecies = DEFAULT_SPECIES

    public readonly formGroup = new ModelFormGroup<FormCharacter>({
        name: new FormControl('', [Validators.required]),
        bio: new FormControl(''),
        age: new FormControl(100, [Validators.required, Validators.min(1)]),
        species: new FormControl('', [Validators.required]),
        combatClass: new FormControl('', [Validators.required]),
        personality: new FormArray([]),
        abilities: new FormArray([]),
    })

    public get personalityFormArray(): FormArray<ModelFormGroup<CharacterTrait>> {
        return this.formGroup.get('personality') as FormArray<ModelFormGroup<CharacterTrait>>
    }

    public get abilitiesFormArray(): FormArray<ModelFormGroup<CharacterAbility>> {
        return this.formGroup.get('abilities') as FormArray<ModelFormGroup<CharacterAbility>>
    }

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

        this.store.personalityTraits$
            .pipe(
                takeUntilDestroyed(this),
                tap(() => this.personalityFormArray.clear()),
                mergeMap(traits => traits),
                map(t => this.createCharacterTraitForm(t))
            )
            .subscribe(f => this.personalityFormArray.push(f))

        this.store.abilities$
            .pipe(
                takeUntilDestroyed(this),
                tap(() => this.abilitiesFormArray.clear()),
                mergeMap(traits => traits),
                map(t => this.createCharacterAbilityForm(t))
            )
            .subscribe(f => this.abilitiesFormArray.push(f))

        this.store.characterIsNew$
            .pipe(takeUntilDestroyed(this))
            .subscribe(isNew => this.editorActive$.next(isNew))
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

        this.store
            .save(patch)
            .subscribe(c => this.router.navigate(['..', c._id],
                {relativeTo: this.activatedRoute, replaceUrl: true}))
    }

    public onAddPersonalityTrait() {
        this.personalityFormArray.push(this.createCharacterTraitForm())
    }

    public onRemovePersonalityTrait(idx: number) {
        this.personalityFormArray.removeAt(idx)
    }

    public onAddAbilityTrait() {
        this.abilitiesFormArray.push(this.createCharacterAbilityForm())
    }

    public onRemoveAbilityTrait(idx: number) {
        this.abilitiesFormArray.removeAt(idx)
    }

    public onDelete() {
        this.store
            .delete()
            .subscribe(() => this.router.navigate(['../../overview'],
                {relativeTo: this.activatedRoute, replaceUrl: true}))
    }

    public onSetSheetImage(e: Event) {
        const target = e.target as HTMLInputElement
        const file = target.files?.item(0)

        if(!!file) this.store.updateSheetImage(file)
    }

    public onRemoveSheetImage() {
        this.store.removeSheetImage()
    }

    private createCharacterTraitForm(trait?: CharacterTrait): ModelFormGroup<CharacterTrait> {
        return new ModelFormGroup<CharacterTrait>({
            label: new FormControl(trait?.label || null, [Validators.required]),
            description: new FormControl(trait?.description || '')
        })
    }

    private createCharacterAbilityForm(ability?: CharacterAbility) {
        return new ModelFormGroup<CharacterAbility>({
            label: new FormControl(ability?.label || null, [Validators.required]),
            description: new FormControl(ability?.description || ''),
            hitDie: new FormControl(ability?.hitDie || 8, [Validators.required, Validators.min(2)]),
            baseDamage: new FormControl(ability?.baseDamage || 10, [Validators.required]),
            shieldBuf: new FormControl(ability?.shieldBuf || 0, [Validators.required]),
            magicResistance: new FormControl(ability?.magicResistance || 0, [Validators.required]),
        })
    }
}
