# Angular Form Types

When using typed reactive forms in Angular you may want to combine it with an existing type instead of soley relying on the returned type. The following code illustrates the issue that arises:

```ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Formify, UndefinedToNull } from '@juriskop/ngx-form-types';

interface CreatePersonDTO {
    name: string;
    birthday?: Date;
    children: CreatePersonDTO[];
    blood: {
        type: 'A' | 'B' | 'C';
        rhesusFactor: '+' | '-' | null; // use null if unknown
    }
}

type PersonFormType = ???;

@Component({
    selector: 'app-create-person',
    templateUrl: './create-person.component.html'
})
export class CreatePersonComponent implements OnInit {
    personForm: PersonFormType;

    constructor(private fb: FormBuilder, private nfb: NullableFormBuilde) {}

    ngOnInit(): void {
        this.personForm = this.fb.group({
            name: this.fb.control('Timothy Gillespie'),
            birthday: this.nfb.control(null),
            children: this.fb.array([] as CreatePersonDTO[]),
            blood: this.fb.group({
                type: this.fb.control('O'),
                rhesusFactor: this.nfb.control(null)
            })
        });
    }
}
```

When creating the `PersonFormType` type we need to create inner FormControls and Arrays. This library handles this use case with the help of the `Formify` utility type along with some other utility types for ease of transformation.

You can now simply define the type as follows:

```ts
type PersonFormType = Formify<UndefinedToNull<CreatePersonDTO>>;
```

# How to Install

The library consists of only types, so including them as a dev dependency will be correct for most situations.

```bash
npm install -D @juriskop/ngx-form-types
```

# How to Use

This library offers the following utility types:

- `Formify`
- `UndefinedToNull`
- `NullToUndefined`
- `AllNullable`

## Formify

The `Formify` utility type serves as the cornerstone of this library. It recursively transforms a given type into its corresponding Angular form representation, wrapping them within `FormControl`, `FormArray`, and `FormGroup` as necessary.

**Example**:
Consider a user data model:

```typescript
type User = {
    id: number;
    name: string;
    roles: string[];
};
```

Using `Formify`, the type gets converted to:

```typescript
type UserForm = Formify<User>;
// Results in:
// FormGroup<{
//   id: FormControl<number>,
//   name: FormControl<string>,
//   roles: FormArray<FormControl<string>>
// }>
```

This makes defining form groups, arrays, and controls much more intuitive and type-safe.

## UndefinedToNull

In many cases, Angular forms consider `null` as a kind of empty or unset value. The `UndefinedToNull` utility type comes handy in situations where your data models might have properties marked as `undefined`, but you want to map them to nullable form controls.

**Example**:
```typescript
type Data = {
    info?: string;
}

type FormData = UndefinedToNull<Data>;
// Results in:
// { info: string | null }
```

This ensures that your form control can be assigned a value of `null`, reflecting its empty state more appropriately.

## NullToUndefined

For users who prefer their data models to signify "no value" with `undefined` rather than `null`, `NullToUndefined` transforms any `null` type to `undefined`.

**Example**:
```typescript
type Data = {
    info: string | null;
}

type FormData = NullToUndefined<Data>;
// Results in:
// { info?: string }
```

This is useful for those who want to maintain a consistent definition of "no value" across their codebase.

## AllNullable

Sometimes, you might want every form control to be nullable, which can be beneficial for forms where most fields are optional but might require a `Validator.required` or similar validation at some points. `AllNullable` recursively converts every type to also include `null`.

**Example**:
```typescript
type Profile = {
    age: number;
    nickname: string;
}

type NullableProfile = AllNullable<Profile>;
// Results in:
// { age: number | null; nickname: string | null }
```

Now, with `NullableProfile`, you can leverage Angular's built-in validators to ensure specific controls have values when necessary.

# Pitfalls and Common Issues

## 1. Optional Arrays with `Formify`

**Issue**: When `Formify` is applied to a type with an optional array property, the resultant type may produce a union that includes both `FormArray` and `FormControl`. This will raise type errors when using the FormBuilder.

**Example**:
```typescript
type User = {
    id: number;
    name: string;
    roles?: string[];
};

// Using Formify
type UserForm = Formify<User>;

// Results in:
// FormGroup<{
//   id: FormControl<number>,
//   name: FormControl<string>,
//   roles: FormArray<FormControl<string>> | FormControl<undefined>
// }>
```

In the above scenario, the `roles` field's type becomes problematic as the FormBuilder will only sign a FormControl or FormArray to it, however this can be solved with type casting.

**Solution**: Consider whether the undefined value on the array field is necessary and could be displayed with an empty array instead. Otherwise, use type casting when using the FormBuilder.

# About Juriskop

"Juriskop" is a government-funded legal tech research project of the law firm Jun Rechtsanwälte in cooperation with the University of Würzburg. Since the beginning of 2022, we have been jointly researching over a period of three years how natural-language individual legal case consulting can succeed with the help of chatbots. Bots instead of lawyers? What still sounds like utopia today could soon be everyday life in the legal professions. By developing chatbot prototypes on selected legal topics, we want to find out how well this can work - but also where other methods might be better suited to advancing legal advice.

Learn more about us under [https://juriskop.de](https://juriskop.de) (German).