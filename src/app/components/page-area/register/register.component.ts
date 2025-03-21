import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { RegisterDto } from '../../../models/register.dto';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { isEmail, strongPassword } from '../../../utils/validators';

@Component({
    selector: 'app-register',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule,
        MatCardModule, CommonModule, MatButtonToggleModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
    // DI's
    private formBuilder = inject(FormBuilder);
    private userService = inject(UserService);
    private router = inject(Router);
    private snackbarService = inject(SnackbarService);

    // Public
    public registerDto = new RegisterDto();
    public registerForm: FormGroup;

    // Methods
    public ngOnInit(): void {
        window.scrollTo(0, 0);

        this.registerForm = this.formBuilder.group({
            usernameControl: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
            emailControl: new FormControl("", [Validators.required, isEmail(), Validators.minLength(10), Validators.maxLength(320)]),
            passwordControl: new FormControl("", [Validators.required, strongPassword()]),
            roleControl: new FormControl(2)
        });
    }

    public async send(): Promise<void> {
        try {
            this.registerDto.name = this.registerForm.get("usernameControl").value;
            this.registerDto.email = this.registerForm.get("emailControl").value;
            this.registerDto.password = this.registerForm.get("passwordControl").value;
            this.registerDto.roleId = this.registerForm.get("roleControl").value;

            await this.userService.register(this.registerDto); // Do not navigate until response
            this.router.navigateByUrl("home");
            this.snackbarService.showSuccess("Welcome, " + this.userService.getUsername());
        }
        catch (err: any) {
            // Register failed
            const errMessage = JSON.parse(err.error).errors;
            this.snackbarService.showError(errMessage);
        }
    }
}
