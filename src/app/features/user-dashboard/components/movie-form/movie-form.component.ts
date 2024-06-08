import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, mergeMap, Observable } from 'rxjs';
import { FileUploadService } from 'src/app/features/user-dashboard/services/file-upload-service/file-upload.service';
import { MovieMetadataService } from 'src/app/features/user-dashboard/services/movie-metadata-service/movie-metadata.service';
import { DragAndDropUploadFileComponent } from '../drag-and-drop-upload-file/drag-and-drop-upload-file.component';
import { FileType } from '../../models/file-type';
import { MovieMetadata } from '../../models/movie-metadata';
import { UserMovieMetadata } from 'src/app/core/models/user-movie-metadata';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [ReactiveFormsModule, DragAndDropUploadFileComponent],
  templateUrl: './movie-form.component.html',
  providers: [MovieMetadataService, FileUploadService],
})
export class MovieFormComponent {
  @Input({ required: true }) isEditMode = false;

  @Input() set movie(movie: UserMovieMetadata | null) {
    if (movie) {
      this.movieForm.patchValue({
        title: movie.title,
        description: movie.description,
        image: this.createUserFilename(movie.title, FileType.Image),
        movie: this.createUserFilename(movie.title, FileType.Movie),
      });
    }
  }

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

    if (this.isEditMode) {
      // TODO: Implement editing
    } else {
      forkJoin([
        this.uploadMovie(),
        this.uploadImage(),
        this.uploadMovieMetadata(this.movieForm.value),
      ]).subscribe();
    }
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

  private uploadImage(): Observable<void> {
    return this.#fileUploadService
      .getLinkForUploadImage()
      .pipe(
        mergeMap((link: string) =>
          this.#fileUploadService.upload(
            this.movieForm.controls.image.value!,
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

  private createUserFilename(title: string, type: FileType): string {
    return `${title}_${type}_file`;
  }
}
