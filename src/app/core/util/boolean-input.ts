/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * To be used on boolean type inputs.
 * Adds support for boolean inputs to be true when just setting the property name in HTML
 *
 * {@param nullOnFalse} is used for properties that should be non-existent if false, like "disabled".
 * (disabled="false" is still a truthy value, so it disabled the element)
 */
export function BooleanInput(nullOnFalse = false): PropertyDecorator {
    return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
        const localKey = `__boolean_input_${String(propertyKey)}__`;

        const infer = (v: unknown) => {
            const boolVal = !!v || v === '';
            return nullOnFalse && !boolVal ? null : boolVal;
        }

        // Init symbol with default value
        target[localKey] = infer(target[propertyKey])

        return Object.defineProperty(target, propertyKey, {
            set(v) {
                (this as any)[localKey] = infer(v);
            },
            get() {
                return (this as any)[localKey];
            },
            configurable: descriptor?.configurable,
            enumerable: descriptor?.enumerable,
        });
    }
}
