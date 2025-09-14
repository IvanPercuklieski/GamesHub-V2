import { Component, inject, input, OnInit, signal } from '@angular/core';
import { GamesService } from '../../services/games-service';
import { IonList, IonItem, IonCardHeader } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-games-top-ten',
  templateUrl: './games-top-ten.component.html',
  styleUrls: ['./games-top-ten.component.scss'],
  imports: [IonItem, IonList],
})
export class GamesTopTenComponent  implements OnInit {
  gamesService = inject(GamesService)
  games = input<any>()
  router = inject(Router)

  ngOnInit() {
    
  }

}
