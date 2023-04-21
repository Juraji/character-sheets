import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router'
import {NgForOf} from '@angular/common'
import {AriaRouterLinkCurrentDirective} from './components/screen-reader-support'

interface MenuItem {
    label: string,
    route: unknown[] | string
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
        NgForOf,
        RouterLink,
        RouterLinkActive,
        AriaRouterLinkCurrentDirective
    ],
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    readonly menuItems: MenuItem[] = [
        {
            label: "Home",
            route: "/home"
        },
        {
            label: "Characters",
            route: "/characters"
        },
    ]
}
