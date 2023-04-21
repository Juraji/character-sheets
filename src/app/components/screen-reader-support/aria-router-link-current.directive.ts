import {Directive, Host, HostBinding} from '@angular/core';
import {RouterLinkActive} from '@angular/router'

@Directive({
    selector: '[appAriaRouterLinkCurrent]',
    standalone: true
})
export class AriaRouterLinkCurrentDirective {

    constructor(@Host() private rla: RouterLinkActive) {
    }

    @HostBinding("attr.aria-current") get ariaCurrent() {
        return this.rla.isActive ? "page" : undefined;
    }

}
