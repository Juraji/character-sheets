import {BehaviorSubject} from 'rxjs'

export class BoolBehaviourSubject extends BehaviorSubject<boolean> {
    constructor(defaultValue = false) {
        super(defaultValue)
    }

    public toggle() {
        this.next(!this.value)
    }

    public enable() {
        if (!this.value) this.next(true)
    }

    public disable() {
        if (this.value) this.next(false)
    }
}
