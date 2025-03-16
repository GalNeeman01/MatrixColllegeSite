import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isEmail(): ValidatorFn {
  const pattern: RegExp = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/; // Email RegEx from back-end
  return (control: AbstractControl): ValidationErrors => {
    return pattern.test(control.value) ? null : { notEmailFormat: true };
  };
}

export function strongPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    if (control.value.length < 8) return { minLength: true };

    const upperCaseRegex: RegExp = /[A-Z]/;
    if (!upperCaseRegex.test(control.value)) return { noUppercase: true };

    const digitRegex: RegExp = /\d/;
    if (!digitRegex.test(control.value)) return { noDigits: true };

    const nonAlphanumeric: RegExp = /[^a-zA-Z0-9]/;
    if (!nonAlphanumeric.test(control.value)) return { noNonAlphanumeric: true };

    return null;
  };
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    // URL regex
    const urlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    return urlPattern.test(control.value) ? null : { invalidUrl: { value: control.value } };
  };
}