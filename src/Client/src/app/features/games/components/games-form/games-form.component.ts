import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonSelect, IonCheckbox, IonContent, IonInput, IonList, IonItem, IonButton, IonModal, IonSelectOption, IonRadio, IonRadioGroup, IonLabel, IonHeader, IonNote } from "@ionic/angular/standalone";
import { Storage } from 'src/app/core/services/storage';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { GamesService } from '../../services/games-service';
import { Toast } from 'src/app/shared/services/toast';
import { QuillModule } from 'ngx-quill';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games-form',
  templateUrl: './games-form.component.html',
  styleUrls: ['./games-form.component.scss'],
  imports: [QuillModule, IonHeader, IonInput, HeaderComponent, IonContent, ReactiveFormsModule, IonButton, IonSelect, IonSelectOption],
})
export class GamesFormComponent  {
  private storage = inject(Storage)
  private gamesService = inject(GamesService)
  private toastService = inject(Toast)
  private router = inject(Router)

  private image = signal<any>(undefined)
  private gameFiles = signal<any>(undefined)
  genres = signal<any>(undefined)
  coverFileName = ''
  zipFileName = ''

  isGenresModalOpen = signal<boolean>(false)

  editorModule = {
    toolbar: [
      [{header: [1, 2, 3, 4, 5, 6]}, 'blockquote', 'code-block', 'clean'],
      ['bold', 'italic', 'underline', 'strike', { list: 'bullet' }, { list: 'ordered' }],
      [{align: []}, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video']
    ]
  }

  gameForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    genres: new FormControl([], [Validators.required]),
    height: new FormControl('600', [Validators.required]),
    width: new FormControl('800', [Validators.required])
  })

  ngOnInit(){
    this.gamesService.getGenres().subscribe({
      next: (resp) => {
        this.genres.set(resp)
      }
    })
  }

  onImageChange(event: any){
    const file = event.target.files[0]
    this.coverFileName = file.name
    this.image.set(file)
  }

  onGameFilesChange(event: any) {
    const file = event.target.files[0]
    this.zipFileName = file.name
    this.gameFiles.set(file)
  }

  onSubmit(){
    if(this.gameForm.invalid){
      this.toastService.show("Fill out the form correctly", 2000, 'warning', 'top')
      return
    }

    if(this.image() === undefined || this.gameFiles() === undefined){
      this.toastService.show("Fill out the form correctly", 2000, 'warning', 'top')
      return
    }

    if (this.gameFiles().name !== 'Game.zip') {
      this.toastService.show("ZIP file must be named 'Game.zip'", 2000, 'warning', 'top');
      return;
    }

    const formValues = this.gameForm.value

    const formData = new FormData
    formData.append('publisherId', this.storage.get<any>('user').id)
    formData.append('name', formValues.name!)
    formData.append('height', formValues.height!)
    formData.append('width', formValues.width!)
    formData.append('description', formValues.description!)
    formData.append('genres', JSON.stringify(formValues.genres))

    if (this.image()) formData.append('coverImage', this.image())
    if (this.gameFiles()) formData.append('zipFile', this.gameFiles())

    this.gamesService.uploadGame(formData).subscribe({
      next: (resp) => {
        // console.log(resp)
        this.toastService.show("Successfully uploaded the game", 2000, 'success', 'top')
        this.gameForm.reset({
          height: '600',
          width: "800"
        })
        this.router.navigate(['games'])
      }
    })
  }
}
