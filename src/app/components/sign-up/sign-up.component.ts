import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PasswordValidators } from 'src/app/validators/validator';
import { NgToastService } from 'ng-angular-popup';

import { Router } from '@angular/router';
import { switchMap, tap} from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { user } from '@angular/fire/auth';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  
  signUpForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, Validators.required),
  }, { validators: passwordsMatchValidator()})

  constructor(private authService: AuthenticationService, private router: Router, private toast: NgToastService,  private usersService: UsersService, private shoppingCartService: ShoppingCartService){}
  passwordsMinLength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      
  
      if (password.length < 6) {
        return { passwordTooShort: true };
      } else {
        return null;
      }
    };
  }
  

  get registerFormControl() {
    return this.signUpForm.controls;
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get name() {
    return this.signUpForm.get('name');
  }
  submit() {
    const { name, email, password } = this.signUpForm.value;

    if (!this.signUpForm.valid || !name || !password || !email) {
      return;
    }
    console.log(user);
    this.authService
    .signUp(email, password).pipe(
      //tap(({user: { uid} }) => console.log("uid in signup: ",uid)),
      tap(({user }) => this.shoppingCartService.createCart(user.uid)),
      switchMap(({user: { uid}})=> this.usersService.addUser({uid, email, displayName: name}))
    )
  
    .subscribe(() => {
      
      this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Signed Up!', duration: 5000});

      this.router.navigate(['/home']);
    }, err=>{
      this.toast.error({detail:"ERROR",summary:'Sign Up failed! Try again.', duration: 5000})
      console.log(err);
    });
    
    
   console.log(this.signUpForm.value);
    console.log(this.signUpForm);
    this.signUpForm.reset();
  }
}