import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router'
import {TranslateModule} from '@ngx-translate/core';

import {CardComponent} from '@components/card'

import {CharactersOverviewStore} from './characters-overview.store'

@Component({
    selector: 'app-characters-overview',
    standalone: true,
    imports: [CommonModule, RouterLink, CardComponent, TranslateModule],
    providers: [CharactersOverviewStore],
    templateUrl: './characters-overview.component.html',
    styleUrls: ['./characters-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersOverviewComponent {
    constructor(public readonly store: CharactersOverviewStore) {
    }
}
