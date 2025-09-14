import { Component, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonPopover, IonItem, IonList, IonMenu, IonMenuButton, IonModal, IonIcon } from "@ionic/angular/standalone";
import { Storage } from 'src/app/core/services/storage';
import { Router } from "@angular/router";
import { Auth } from 'src/app/features/auth/services/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonIcon, IonModal, IonList, IonItem, IonPopover, IonTitle, IonToolbar, IonButtons, IonButton, IonContent, IonHeader],
})
export class HeaderComponent{
  showButtons = input<boolean>(true)
  storage = inject(Storage)
  user = signal<any>(undefined)
  authService = inject(Auth)
  router = inject(Router)
  popoverEvent: any

  isUserMenuOpen = signal<boolean>(false)

  isNavModalOpen = signal<boolean>(false)

  @ViewChild('navModal') navModal!: IonModal;

  ngOnInit(){
    this.user.set(this.storage.get('user'))
  }

  logout(){
    this.closeModal()
    this.authService.logout()
    this.router.navigate(['auth', 'login'])
  }

  openUserMenu(event: any){
    this.popoverEvent = event
    this.isUserMenuOpen.set(true)
  }

  closeModal(){
    this.isNavModalOpen.set(false)
    this.navModal.dismiss()
  }

  goToProfile(){
    this.closeModal()
    this.router.navigate(['profile', this.user().id])
  }

  goToUpload(){
    this.closeModal()
    this.router.navigate(['games', 'upload'])
  }

  goToHome(){
    this.closeModal()
    this.router.navigate(['games'])
  }

  goToBrowse(){
    this.closeModal()
    this.router.navigate(['games', 'browse'])
  }

  navigateToHome(): void {
    const homeUrl = '/games';
    
    if (this.router.url === homeUrl) {
      window.location.reload()
    } else {
      this.router.navigate([homeUrl])
    }
  }


}
