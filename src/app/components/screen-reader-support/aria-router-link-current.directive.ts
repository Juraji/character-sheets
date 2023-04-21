import {Directive, Host, HostBinding} from '@angular/core';
import {RouterLinkActive} from '@angular/router'

@Directive({
    selector: '[appAriaRouterLinkCurrent]',
    standalone: true
})
export class AriaRouterLinkCurrentDirective {

    public constructor(@Host() private rla: RouterLinkActive) {
    }

    @HostBinding('attr.aria-current')
    public get ariaCurrent() {
        return this.rla.isActive ? 'page' : undefined;
    }

}
