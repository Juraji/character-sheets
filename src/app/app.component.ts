import {CommonModule} from '@angular/common'
import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router'

import {AriaRouterLinkCurrentDirective} from '@components/screen-reader-support'

interface MenuItem {
    label: string,
    route: unknown[] | string
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [
        CommonModule,
        AriaRouterLinkCurrentDirective,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public readonly menuItems: MenuItem[] = [
        {
            label: 'Characters',
            route: '/characters'
        },
        {
            label: 'Stories',
            route: '/stories'
        },
    ]
}
