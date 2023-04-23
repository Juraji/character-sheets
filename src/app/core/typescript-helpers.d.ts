type Nullable<T> = T | null | undefined
type NullableProperties<T> = {
    [P in keyof T]: T[P] | null;
}
