import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {CardComponent} from '@components/card';
import {MainMenuComponent} from '@components/main-menu';
import {NotPipe} from '@components/pipes';

import {StoryOverviewStore} from './story-overview.store';


@Component({
    selector: 'app-story-overview',
    standalone: true,
    imports: [CommonModule, CardComponent, RouterLink, NotPipe, TranslateModule, MainMenuComponent],
    providers: [StoryOverviewStore],
    templateUrl: './story-overview.component.html',
    styleUrls: ['./story-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryOverviewComponent {

    constructor(public readonly store: StoryOverviewStore) {
    }

}
