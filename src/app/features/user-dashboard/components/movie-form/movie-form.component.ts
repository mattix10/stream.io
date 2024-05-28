import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, mergeMap, Observable } from 'rxjs';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';
import { FileUploadService } from 'src/app/core/services/file-upload-service/file-upload.service';
import { MovieMetadataService } from 'src/app/core/services/movie-metadata-service/movie-metadata.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.scss',
  providers: [MovieMetadataService, FileUploadService],
})
export class MovieFormComponent {
  movieForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    image: new FormControl(null),
    movie: new FormControl(null),
  });
  movieFilename: string = '';
  imageFilename: string = '';

  readonly #fileUploadService = inject(FileUploadService);
  readonly #movieMetadataService = inject(MovieMetadataService);

  onImageSelected(event: any): void {
    this.movieForm.controls.image = event.target.files[0];
    this.imageFilename = (this.movieForm.controls.image.value! as File).name;
  }

  onMovieSelected(event: any): void {
    this.movieForm.controls.movie.patchValue(event.target.files[0]);
    this.movieFilename = (this.movieForm.controls.movie.value! as File).name;
  }

  removeFile(controlName: 'image' | 'movie'): void {
    this.movieForm.controls[controlName].patchValue(null);
  }

  onSubmit(): void {
    if (this.movieForm.invalid || !this.movieForm.value.movie) {
      return;
    }

    forkJoin([
      // this.uploadImage(),
      this.uploadMovie(),
      this.uploadMovieMetadata(this.movieForm.value),
    ]).subscribe();
  }

  private uploadImage(): void {
    // TODO: Implement this method
  }

  private uploadMovie(): Observable<void> {
    return this.#fileUploadService
      .getLinkForUploadMovie()
      .pipe(
        mergeMap((link: string) =>
          this.#fileUploadService.upload(
            this.movieForm.controls.movie.value!,
            link
          )
        )
      );
  }

  private uploadMovieMetadata({
    title,
    description,
  }: any): Observable<MovieMetadata> {
    return this.#movieMetadataService.uploadMovieMetadata(title, description);
  }
}
