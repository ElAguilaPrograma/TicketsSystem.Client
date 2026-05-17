import { inject, Injectable } from "@angular/core";
import { ValidRoles } from "../enums/valid_roles.enum";
import { ValidatorFn } from "@angular/forms";
import { ToastService } from "../services/toast.service";

@Injectable({
    providedIn: 'root'
})
export class UserValidations {
    private toastService = inject(ToastService);

    validateRole(): ValidatorFn {
        return (control) => {
            const value = control.value;
            if (!value) {
                return null;
            }
            if (!Object.values(ValidRoles).includes(value)) {
                this.toastService.error('Invalid role', 'Please select a valid role', 'Valid roles are: ' + Object.values(ValidRoles).join(', '));
                return { invalidRole: true };
            }
            return null;
        };
    }

    validatePassword(): ValidatorFn {
        return (control) => {
            const value = control.value;
            if (!value) {
                return null;
            }
            if (value.length < 5) {
                return { invalidPassword: true };
            }
            if (!/[A-Z]/.test(value)) {
                return { invalidPassword: true };
            }
            if (!/[a-z]/.test(value)) {
                return { invalidPassword: true };
            }
            if (!/[0-9]/.test(value)) {
                return { invalidPassword: true };
            }
            return null;
        };
    }

    validateConfirmPassword(): ValidatorFn {
        return (control) => {
            const value = control.value;
            if (!value) {
                return null;
            }
            if (value !== control.root.get('password')?.value) {
                return { invalidConfirmPassword: true };
            }
            return null;
        };
    }

    validateProfilePic(): ValidatorFn {
        return (control) => {
            const value = control.value;
            if (!value) {
                return null;
            }
            return null;
        };
    }
}