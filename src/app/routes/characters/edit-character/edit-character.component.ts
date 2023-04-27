import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {TranslateModule} from '@ngx-translate/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'
import {map, mergeMap, tap} from 'rxjs'

import {AttachmentImgComponent} from '@components/attachment-img';
import {CardComponent} from '@components/card'
import {MainMenuComponent} from '@components/main-menu';
import {ArrayIndexSeqPipe, NotPipe} from '@components/pipes'
import {ReadOnlyFieldComponent} from '@components/read-only-field'
import {TwoFactorButtonComponent} from '@components/two-factor-button'
import {ModelFormGroup} from '@core/forms'
import {takeUntilDestroyed} from '@core/rxjs'
import {BoolBehaviourSubject} from '@core/rxjs/bool-behaviour-subject'
import {CharacterAbility} from '@db/model'

import {EditCharacterStore, FormCharacter} from './edit-character.store'

const ABILITY_DEFAULTS: CharacterAbility = {
    label: '',
    description: '',
    baseDamage: 10,
    hitDie: 8,
    magicResistance: 0,
    shieldBuf: 0
}

@Component({
    selector: 'app-edit-character',
    standalone: true,
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, CardComponent, NotPipe, BsDropdownModule, ReadOnlyFieldComponent, ArrayIndexSeqPipe, NgOptimizedImage, TwoFactorButtonComponent, AttachmentImgComponent, MainMenuComponent],
    providers: [EditCharacterStore],
    templateUrl: './edit-character.component.html',
    styleUrls: ['./edit-character.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCharacterComponent implements OnInit, OnDestroy {

    public readonly editorActive$ = new BoolBehaviourSubject()

    public readonly formGroup = new ModelFormGroup<FormCharacter>({
        name: new FormControl('', [Validators.required]),
        bio: new FormControl(''),
        age: new FormControl(100, [Validators.required, Validators.min(1)]),
        species: new FormControl('', [Validators.required]),
        combatClass: new FormControl('', [Validators.required]),
        abilities: new FormArray([]),
    })

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

        if (!!file) this.store.updateSheetImage(file)
    }

    public onRemoveSheetImage() {
        this.store.removeSheetImage()
    }

    private createCharacterAbilityForm(ability = ABILITY_DEFAULTS) {
        return new ModelFormGroup<CharacterAbility>({
            label: new FormControl(ability.label, [Validators.required]),
            description: new FormControl(ability.description),
            hitDie: new FormControl(ability.hitDie, [Validators.required, Validators.min(2)]),
            baseDamage: new FormControl(ability.baseDamage, [Validators.required]),
            shieldBuf: new FormControl(ability.shieldBuf, [Validators.required]),
            magicResistance: new FormControl(ability.magicResistance, [Validators.required]),
        })
    }
}
