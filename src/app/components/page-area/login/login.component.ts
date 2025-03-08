import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CredentialsModel } from '../../../models/credentials.model';
import { UserService } from '../../../services/user.service';
import { isEmail } from '../../../utils/validators';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatInputModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  public credentials = new CredentialsModel();
  public userForm: FormGroup;

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  public ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      emailControl: new FormControl("", [Validators.required, isEmail()]),
      passwordControl: new FormControl("", [Validators.required, Validators.minLength(8)])
    })
  }

  public async send() : Promise<void> {
    try
    {
      this.credentials.email = this.userForm.get("emailControl").value;
      this.credentials.password = this.userForm.get("passwordControl").value;
  
      await this.userService.login(this.credentials);

      this.router.navigateByUrl("home");
    }
    catch (err: any)
    {
        // If incorrect credentials:
        this.userForm.get("emailControl").setValue("");
        this.userForm.get("passwordControl").setValue("");

        const errMessage = JSON.parse(err.error).errors;

        console.log(errMessage);
    }
  }
}
