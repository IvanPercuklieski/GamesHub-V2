import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { IonContent, IonTitle, IonHeader } from "@ionic/angular/standalone";
import { GamesListComponent } from "src/app/features/games/components/games-list/games-list.component";
import { GamesService } from 'src/app/features/games/services/games-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [IonHeader, IonTitle, HeaderComponent, IonContent, GamesListComponent],
})
export class ProfileComponent  implements OnInit {
  gamesService = inject(GamesService)
  route = inject(ActivatedRoute)

  games = signal<any>(undefined)
  publisherId!: string

  ngOnInit() {
    this.publisherId = this.route.snapshot.paramMap.get('id')!
    this.gamesService.getGamesByUserId(this.publisherId).subscribe({
      next: (games) => {
        this.games.set(games)
      }
    })
  }

}
