import { FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { Formify } from '../src/index';
import { UndefinedToNull } from '../src/form-types';

type CustomType = {
    a: number | undefined;
    b: {
      c: string | undefined;
      d: (boolean | undefined)[];
    };
    e: number[];
  };
  
const fb = new FormBuilder();
const nfb = new FormBuilder().nonNullable;

type CustomTypeForm = Formify<UndefinedToNull<CustomType>>; 

const customTypeForm: CustomTypeForm = fb.group({
    a: fb.control(3),
    b: fb.group({
        c: fb.control('hello'),
        d: fb.array([] as boolean[]),
    }),
    e: nfb.array([] as number[])
})