import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonContent, IonGrid, IonRow, IonCol, IonTitle, IonHeader, IonInfiniteScrollContent, IonInfiniteScroll, IonFooter, IonToolbar } from "@ionic/angular/standalone";
import { GamesListComponent } from "../games-list/games-list.component";
import { GamesTopTenComponent } from "../games-top-ten/games-top-ten.component";
import { GamesService } from '../../services/games-service';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.scss'],
  imports: [IonHeader, IonTitle, HeaderComponent, IonContent, GamesListComponent, GamesTopTenComponent],
})
export class GamesPageComponent {
  gamesService = inject(GamesService)
  games = signal<any>(undefined)
  genres = signal<any>(undefined)
  topTenGames = signal<any>(undefined)

  isLoading = true
  
  ionViewWillEnter(){
    this.isLoading = true
    this.games.set([])
    this.gamesService.getGenres().subscribe({
      next: (resp) => {
        this.genres.set(resp)
      }
    })

   this.gamesService.getPagedGames(0, 35).subscribe({
      next: (games) => {
        this.games.set(games)

         this.gamesService.getTopTenGames().subscribe({
          next: (games) => {
            this.topTenGames.set(games)
            this.isLoading = false
          }
        })
      }
    })

   
  }

}
