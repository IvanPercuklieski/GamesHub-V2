import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonHeader, IonContent, IonSearchbar, IonCheckbox, IonAccordionGroup, IonAccordion, IonItem, IonInfiniteScrollContent, IonInfiniteScroll } from "@ionic/angular/standalone";
import { GamesListComponent } from "../games-list/games-list.component";
import { GamesService } from '../../services/games-service';

@Component({
  selector: 'app-browse-games',
  templateUrl: './browse-games.component.html',
  styleUrls: ['./browse-games.component.scss'],
  imports: [IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonCheckbox, IonSearchbar, HeaderComponent, IonHeader, IonContent, GamesListComponent, IonAccordionGroup, IonAccordion]
})
export class BrowseGamesComponent {
  gamesService = inject(GamesService)

  games = signal<any[]>([])
  filteredGames = signal<any[]>([])
  genres = signal<any>(undefined)
  selectedGenres = signal<number[]>([])

  take = 25
  skip = 0

  searchFilter = ''

  hasMore = signal<boolean>(true)

  ionViewWillEnter() {
    this.loadGames()
  }

  loadGames(){
    this.games.set([])
    this.filteredGames.set([])
    this.hasMore.set(true)
    this.skip = 0

    this.gamesService.getPagedGames(this.skip, this.take).subscribe({
      next: (resp) => {
        if(resp.length < this.take){
          this.hasMore.set(false)
        }

        this.games.set(resp)
        this.filteredGames.set(this.games())

        this.gamesService.getGenres().subscribe({
          next: (resp) => {
            this.genres.set(resp)
          }
        })
      }
    })
  }

    onGenreToggle(genreId: number, checked: boolean){
      const current = this.selectedGenres();
      if(checked){
        this.selectedGenres.update(prev => [...prev, genreId]);
      } else {
        this.selectedGenres.set(current.filter(id => id !== genreId));
      }


    this.filterGames();
  }

  filterGames(){
    if(this.selectedGenres().length === 0){
      this.filteredGames.set(this.games());
      return;
    }

    this.filteredGames.set(
      this.games().filter(g => 
        g.genres.some((genre: { id: number }) => this.selectedGenres().includes(genre.id))
      )
    );
  }

  onIonInfinite(event: any){
    if(this.hasMore()){
      this.skip += this.take
      this.gamesService.getPagedGames(this.skip, this.take, this.searchFilter).subscribe({
        next: (resp) => {
          if(resp.length < this.take){
            this.hasMore.set(false)
          }

          this.games.update(prev => [...prev, ...resp])
          this.filterGames()
          event.target.complete()
        },
        error: () => {
          event.target.complete()
        }
      })
    }else{
      event.target.complete()
    }
  }

  searchGames(event: any){
    this.skip = 0
    this.hasMore.set(true)
    this.searchFilter = event.target.value
    this.gamesService.getPagedGames(this.skip, this.take, this.searchFilter).subscribe({
      next: (resp) => {
        this.games.set(resp)
        this.filterGames()
      }
    })
  }
}
