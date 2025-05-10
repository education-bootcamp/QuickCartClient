import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
    MatButton,
    MatLabel,
    NgIf,
    MatProgressSpinner,
    MatCheckbox,
    FormsModule,
    MatFormField
  ],
  standalone:true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent{
  form: FormGroup;
  loading = false;
  showPassword = false;

  constructor(private router: Router, private fb: FormBuilder,private userService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/), Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/), Validators.minLength(2)]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[@&$])[A-Za-z0-9@&$]{6,}$/)
      ]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.userService.register(
      this.form.value.email?.trim()!,
      this.form.value.password?.trim()!,
      this.form.value.firstName?.trim()!,
      this.form.value.lastName?.trim()!).subscribe(response => {
      this.loading = false;
      this.router.navigateByUrl('/security/context/confirm-otp/' + this.form.value.email?.trim()!);
    }, error => {
      this.loading = false;
    })

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      alert('User signed up:\n' + JSON.stringify(this.form.value, null, 2));
    }, 1000);
  }
}
