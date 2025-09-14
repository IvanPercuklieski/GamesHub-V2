import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonCard, IonCardHeader, IonTitle, IonCardTitle, IonCardSubtitle, IonCardContent, IonButtons, IonButton, IonItem } from "@ionic/angular/standalone";
import { GamesService } from '../../services/games-service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton]
})
export class GameCardComponent  {
  router = inject(Router)
  game = input.required<any>()
  showDeleteButton = signal<boolean>(false)
  gameService = inject(GamesService)

  ngOnInit(){
    if(this.router.url.startsWith('/profile')){
      this.showDeleteButton.set(true)
    }
  }

  deleteGame(gameId: string){
    this.gameService.deleteGame(gameId).subscribe({
      next: () => {
        window.location.reload()
      }
    })
  }

}
