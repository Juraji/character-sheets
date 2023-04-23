import {Directive, HostBinding, OnInit} from '@angular/core'

import {uuidGenerator} from '@core/util/sequences'

@Directive()
export abstract class ComponentWithUniqueId implements OnInit {
    private static readonly ID_GENERATOR = uuidGenerator(true)
    private readonly suffixIdCache: Map<string, string> = new Map()

    @HostBinding('attr.id')
    public id: Nullable<string>

    protected constructor(private readonly prefix: string) {
    }

    public ngOnInit() {
        this.id = `${this.prefix}-${ComponentWithUniqueId.ID_GENERATOR.next().value}`
    }

    public suffixId(suffix: string) {
        if (this.suffixIdCache.has(suffix)) {
            return this.suffixIdCache.get(suffix)
        } else {
            const id = `${this.id}-${suffix}`
            this.suffixIdCache.set(suffix, id)
            return id
        }
    }
}
