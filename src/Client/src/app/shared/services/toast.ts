import { inject, Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class Toast {
  toastController = inject(ToastController)

  async show(message: string, duration: number = 2000, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary', position: 'top' | 'middle' | 'bottom' = 'top') {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position
    });
    await toast.present();
  }
}
