import { FormControl, ValidationErrors } from "@angular/forms";

export class TechTonicValidators {

    // whitespace validation
    // imported Validation errors from angular form api
    // If validation check fails, then return validation errors
    // If validation check passes, then return null
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors {

        // check if string contains only whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // invalid, return error object
            // HTML template will check for this error key 'notOnlyWhiteSpace' to determine if it needs to display an error message
            return { 'notOnlyWhiteSpace': true };
        }
        else {
            // valid, return null
            return null;
        }

    }
}
