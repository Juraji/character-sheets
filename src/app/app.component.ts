import {CommonModule} from '@angular/common'
import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router'
import {TranslateModule} from '@ngx-translate/core';

import {AriaRouterLinkCurrentDirective} from '@components/screen-reader-support'

interface MenuItem {
    label: string,
    route: unknown[] | string
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        AriaRouterLinkCurrentDirective,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        TranslateModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public readonly menuItems: MenuItem[] = [
        {
            label: 'characters.labels.characters',
            route: '/characters'
        },
        {
            label: 'stories.labels.stories',
            route: '/stories'
        },
    ]

    constructor() {
    }
}
