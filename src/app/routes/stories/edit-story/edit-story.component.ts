import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {CardComponent} from '@components/card';
import {NotPipe} from '@components/pipes';
import {TwoFactorButtonComponent} from '@components/two-factor-button';
import {StoryStatus} from '@core/db/model';
import {ModelFormGroup} from '@core/forms';
import {BoolBehaviourSubject, takeUntilDestroyed} from '@core/rxjs';

import {EditStoryStore, StoreStory} from './edit-story.store';


@Component({
    selector: 'app-edit-story',
    standalone: true,
    imports: [CommonModule, CardComponent, NotPipe, ReactiveFormsModule, TwoFactorButtonComponent],
    providers: [EditStoryStore],
    templateUrl: './edit-story.component.html',
    styleUrls: ['./edit-story.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditStoryComponent implements OnInit, OnDestroy {
    public readonly editorActive$ = new BoolBehaviourSubject()

    public readonly formGroup = new ModelFormGroup<StoreStory>({
        title: new FormControl('', [Validators.required]),
        status: new FormControl<StoryStatus>('CONCEPT', [Validators.required]),
        draftText: new FormControl()
    })

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        public readonly store: EditStoryStore
    ) {
    }

    public ngOnInit() {
        this.store.story$
            .pipe(takeUntilDestroyed(this))
            .subscribe(s => this.formGroup.patchValue(s))

        this.editorActive$
            .pipe(takeUntilDestroyed(this))
            .subscribe(edit => edit
                ? this.formGroup.enable()
                : this.formGroup.disable())

        this.store.storyIsNew$
            .pipe(takeUntilDestroyed(this))
            .subscribe(isNew => this.editorActive$.next(isNew))
    }

    public ngOnDestroy() {
    }

    public onFormSubmit() {
        if (this.formGroup.invalid) return
        this.editorActive$.disable()
        const patch = this.formGroup.value

        this.store
            .save(patch)
            .subscribe(s => this.router
                .navigate(['..', s._id], {relativeTo: this.activatedRoute, replaceUrl: true}))
    }

    public onDeleteStory() {
        this.store
            .delete()
            .subscribe(() => this.router
                .navigate(['../../overview'], {relativeTo: this.activatedRoute, replaceUrl: true}))
    }
}
