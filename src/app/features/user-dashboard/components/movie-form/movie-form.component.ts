import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, mergeMap, Observable } from 'rxjs';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';
import { FileUploadService } from 'src/app/core/services/file-upload-service/file-upload.service';
import { MovieMetadataService } from 'src/app/core/services/movie-metadata-service/movie-metadata.service';
import { DragAndDropUploadFileComponent } from '../drag-and-drop-upload-file/drag-and-drop-upload-file.component';
import { FileType } from 'src/app/core/models/file-type';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragAndDropUploadFileComponent],
  templateUrl: './movie-form.component.html',
  providers: [MovieMetadataService, FileUploadService],
})
export class MovieFormComponent {
  movieForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    image: new FormControl(),
    movie: new FormControl(),
  });

  readonly fileType = FileType;
  readonly #fileUploadService = inject(FileUploadService);
  readonly #movieMetadataService = inject(MovieMetadataService);

  onUploadImage(file: File): void {
    this.movieForm.controls.image.patchValue(file);
  }

  onUploadMovie(file: File): void {
    this.movieForm.controls.movie.patchValue(file);
  }

  onRemoveImage(): void {
    this.movieForm.controls.image.patchValue(null);
  }

  onRemoveMovie(): void {
    this.movieForm.controls.movie.patchValue(null);
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
