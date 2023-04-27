import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {map, Observable} from 'rxjs';

import {AriaRouterLinkCurrentDirective} from '@components/screen-reader-support';
import {ReplicationStatus, ReplicationStatusMessage} from '@db/model';
import {DbReplicationService} from '@db/query';

interface MenuItem {
    label: string,
    route: unknown[] | string
}

interface DisplayReplicationStatus extends ReplicationStatusMessage {
    classNames: string[],
    tooltipKey: string
}

const REPLICATION_STATUS_DISPLAY_TEMPLATES: Record<ReplicationStatus, Omit<DisplayReplicationStatus, keyof ReplicationStatusMessage>> = {
    PAUSED: {
        classNames: ['bi-database-fill-check', 'text-success'],
        tooltipKey: 'components.mainMenu.replicationStatus.tooltip.paused'
    },
    ACTIVE: {
        classNames: ['bi-database-fill-up', 'text-success'],
        tooltipKey: 'components.mainMenu.replicationStatus.tooltip.active'
    },
    DENIED: {
        classNames: ['bi-database-fill-lock', 'text-danger'],
        tooltipKey: 'components.mainMenu.replicationStatus.tooltip.denied'
    },
    ERROR: {
        classNames: ['bi-database-fill-exclamation', 'text-danger'],
        tooltipKey: 'components.mainMenu.replicationStatus.tooltip.error'
    },
    COMPLETE: {
        classNames: ['bi-database-fill-dash', 'text-warning'],
        tooltipKey: 'components.mainMenu.replicationStatus.tooltip.complete'
    },
}

@Component({
    selector: 'app-main-menu',
    standalone: true,
    imports: [CommonModule, AriaRouterLinkCurrentDirective, RouterLink, RouterLinkActive, TranslateModule],
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {

    public readonly dbReplicationStatus$: Observable<DisplayReplicationStatus> = this.dbReplicationService.status$.pipe(
        map(statusMessage => ({
            ...statusMessage,
            ...REPLICATION_STATUS_DISPLAY_TEMPLATES[statusMessage.status]
        }))
    )

    public readonly menuItems: MenuItem[] = [
        {
            label: 'characters.labels.characters',
            route: '/characters'
        },
        {
            label: 'stories.labels.stories',
            route: '/stories'
        },
        {
            label: 'settings.labels.settings',
            route: '/settings'
        },
    ]

    constructor(private readonly dbReplicationService: DbReplicationService) {
    }

}
