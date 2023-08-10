import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type Formify<T> = FormifyActual<T>;

export type FormifyActual<T> = [T] extends [(infer U)[]]
    ? FormArray<FormifyActual<U>>
    : [T] extends [object]
    ? FormGroup<{ [P in keyof T]-?: FormifyActual<T[P]> }>
    : FormControl<T>;

export type UndefinedToNull<T> = T extends undefined
    ? null
    : T extends (infer U)[]
    ? UndefinedToNull<U>[]
    : T extends object
    ? {
          [K in keyof T]-?: T[K] extends undefined
              ? null
              : UndefinedToNull<T[K]>;
      }
    : T;

export type NullToUndefined<T> = T extends null
    ? undefined
    : T extends (infer U)[]
    ? NullToUndefined<U>[]
    : T extends object
    ? {
          [K in keyof T]-?: T[K] extends null
              ? undefined
              : NullToUndefined<T[K]>;
      }
    : T;

export type AllNullable<T> = [T] extends [(infer U)[]]
    ? AllNullable<U>[]
    : [T] extends [object]
    ? { [P in keyof T]-?: AllNullable<T[P]> }
    : T | null;
