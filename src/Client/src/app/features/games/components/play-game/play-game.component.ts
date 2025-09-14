import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonContent, IonHeader } from "@ionic/angular/standalone";
import { GamesService } from '../../services/games-service';
import { SafeUrlPipe } from 'src/app/core/pipes/safe-url-pipe-pipe';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  imports: [HeaderComponent, IonContent, SafeUrlPipe, IonHeader],
})
export class PlayGameComponent  implements OnInit {
  route = inject(ActivatedRoute)
  gamesService = inject(GamesService)

  game = signal<any>(undefined)
  gameId!: string
  highScores = signal<any>(undefined)
  extraData: 'desc' | 'scores' = 'desc'

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id')!
    this.gamesService.getGameById(this.gameId).subscribe({
      next: (game) => {
        this.game.set(game)

        this.gamesService.getHighScores(this.gameId).subscribe({
          next: (resp) => {
            (resp as any).sort((a: { score: number; }, b: { score: number; }) => b.score - a.score) 
            this.highScores.set(resp)
          }
        })
      }
    })

    this.gamesService.increaseClicks(this.gameId).subscribe()
  }

}
