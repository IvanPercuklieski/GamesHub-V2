import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonButton, IonInputPasswordToggle, IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { Auth } from '../../services/auth';
import { Storage } from 'src/app/core/services/storage';
import { Toast } from 'src/app/shared/services/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonTitle, IonToolbar, IonHeader, IonInput, IonContent, IonButton, IonInputPasswordToggle, ReactiveFormsModule],
})
export class LoginComponent {
  router = inject(Router)
  authService = inject(Auth)
  storage = inject(Storage)
  toastService = inject(Toast)

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  onSubmit(){
    if(this.loginForm.valid){
      const formData = this.loginForm.value

      this.authService.login(formData.username!, formData.password!).subscribe({
        next: (resp: any) => {
          this.storage.set("user", resp)
          this.toastService.show(`${resp.username} successfully logged in!`, 2000, 'success', 'top')
          this.router.navigate(['games'])
        }
      })
    }
  }

}
