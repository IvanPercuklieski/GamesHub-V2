import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Storage } from 'src/app/core/services/storage';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  http = inject(HttpClient)
  private apiUrl = 'https://localhost:7220/api/Games'
  storage = inject(Storage)

  uploadGame(payload: FormData){
    return this.http.post(`${this.apiUrl}/upload`, payload)
  }

  getGames(){
    return this.http.get(`${this.apiUrl}`)
  }

  getGameById(id: string){
    return this.http.get(`${this.apiUrl}/${id}`)
  }

  getTopTenGames(){
    return this.http.get(`${this.apiUrl}/top`)
  }

  getGamesByUserId(id: string){
    return this.http.get(`${this.apiUrl}/publisher/${id}`)
  }

  deleteGame(gameId: string) {
    const publisherId = this.storage.get<any>('user').id;
    return this.http.delete(`${this.apiUrl}/${gameId}?publisherId=${publisherId}`);
  }

  increaseClicks(gameId: string){
    return this.http.post(`${this.apiUrl}/${gameId}/click`, null)
  }

  getGenres(){
    return this.http.get(`${this.apiUrl}/genres`)
  }

  getPagedGames(skip: number = 0, take: number = 10, filter: string = ''){
    if(filter){
      return this.http.get<[]>(`${this.apiUrl}/paged?skip=${skip}&take=${take}&filter=${filter}`)
    }
    return this.http.get<[]>(`${this.apiUrl}/paged?skip=${skip}&take=${take}`)
  }

  getHighScores(gameId: string){
    return this.http.get<[]>(`${this.apiUrl}/${gameId}/highscores`)
  }
}
