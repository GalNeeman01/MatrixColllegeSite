import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isEmail(): ValidatorFn {
    const pattern: RegExp = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/; // Email RegEx from back-end
    return (control: AbstractControl): ValidationErrors => {
        return pattern.test(control.value) ? null : { notEmailFormat: true };
    };
}

export function strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
        if (control.value == null) return { noValueError: true };

        if (control.value.length < 8) return { minLengthError: true };

        const upperCaseRegex: RegExp = /[A-Z]/;
        if (!upperCaseRegex.test(control.value)) return { noUppercase: true };

        const digitRegex: RegExp = /\d/;
        if (!digitRegex.test(control.value)) return { noDigits: true };

        const nonAlphanumeric: RegExp = /[^a-zA-Z0-9]/;
        if (!nonAlphanumeric.test(control.value)) return { noNonAlphanumeric: true };

        return null;
    };
}