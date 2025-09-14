import { Component, inject, input, OnInit, signal } from '@angular/core';
import { GamesService } from '../../services/games-service';
import { GameCardComponent } from "../game-card/game-card.component";
import { IonCol, IonRow } from "@ionic/angular/standalone";

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
  imports: [GameCardComponent],
})
export class GamesListComponent  {
  private gamesService = inject(GamesService)

  games = input<any>(undefined)

  

}
