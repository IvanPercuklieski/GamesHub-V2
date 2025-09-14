import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonButton, IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { Auth } from '../../services/auth';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { Toast } from 'src/app/shared/services/toast';
import { Storage } from 'src/app/core/services/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonTitle, IonToolbar, IonHeader, IonInput, IonContent, ReactiveFormsModule, IonButton],
})
export class RegisterComponent  {
  router = inject(Router)
  private toastService = inject(Toast)
  private authService = inject(Auth)
  private storage = inject(Storage)

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required])
  })

  onSubmit(){
    if(this.registerForm.valid){
      const formData = this.registerForm.value

      this.authService.register(formData.username!, formData.email!, formData.password!).subscribe({
        next: (resp: any) => {
          this.toastService.show(`Successfully registered ${resp.username}`, 2500, 'success', 'top')
          this.router.navigate(['auth', 'login'])
        },
        error: (e) => {
          this.toastService.show(e.error, 3000, 'warning', 'top')
        }
      })
    }
  }
}
