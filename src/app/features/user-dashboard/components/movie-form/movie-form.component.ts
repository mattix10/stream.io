import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  combineLatest,
  EMPTY,
  finalize,
  mergeMap,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { FileUploadService } from 'src/app/features/user-dashboard/services/file-upload-service/file-upload.service';
import { MovieMetadataService } from 'src/app/features/user-dashboard/services/movie-metadata-service/movie-metadata.service';
import { DragAndDropUploadFileComponent } from '../drag-and-drop-upload-file/drag-and-drop-upload-file.component';
import { FileType } from '../../models/file-type';
import { UserMovieMetadata } from 'src/app/core/models/user-movie-metadata';
import { ToastrService } from 'ngx-toastr';
import { isLoading } from 'src/app/features/auth/models/loading';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragAndDropUploadFileComponent,
    SpinnerComponent,
  ],
  templateUrl: './movie-form.component.html',
  providers: [MovieMetadataService, FileUploadService],
})
export class MovieFormComponent implements isLoading {
  @Input({ required: true }) set isEditMode(isEditMode: boolean) {
    this._isEditMode = isEditMode;
    if (!this._isEditMode) this.movieForm.reset();
  }

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

  isLoading: boolean = false;
  _isEditMode = false;

  readonly fileType = FileType;
  readonly #fileUploadService = inject(FileUploadService);
  readonly #movieMetadataService = inject(MovieMetadataService);
  readonly #toastrService = inject(ToastrService);

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
    console.log(this.movieForm);
    if (this.movieForm.invalid) return;

    this.isLoading = true;

    if (this.isEditMode) {
      // TODO: Implement editing
    } else {
      this.uploadMovieMetadata(this.movieForm.value)
        .pipe(
          switchMap((isSuccess: boolean) => {
            if (isSuccess) {
              this.#toastrService.success('Metadane zostały wgrane pomyślnie.');

              return combineLatest([this.uploadMovie(), this.uploadImage()]);
            }

            return of(EMPTY);
          }),
          finalize(() => (this.isLoading = false))
        )
        .subscribe((results) => {
          if (results) {
            const [uploadMovieResult, uploadImageResult] = results as any;

            if (uploadMovieResult) {
              this.#toastrService.success('Film został wgrany pomyślnie');
            }
            if (uploadImageResult) {
              this.#toastrService.success('Obraz został wgrany pomyślnie');
            }
          }
        });
    }
  }

  private uploadMovie(): Observable<null> {
    if (!this.movieForm.get('movie')) return of(null);

    return this.#fileUploadService.getLinkForUploadMovie().pipe(
      mergeMap((link: string) =>
        this.#fileUploadService
          .upload(this.movieForm.controls.movie.value!, link)
          .pipe(
            catchError(() => {
              throw new Error();
            })
          )
      ),
      catchError(() => {
        this.#toastrService.error('Wgrywanie filmu nie powiodło się.');
        return of(null);
      })
    );
  }

  private uploadImage(): Observable<any> {
    if (!this.movieForm.get('image')) return of(null);

    return this.#fileUploadService.getLinkForUploadImage().pipe(
      mergeMap((link: string) =>
        this.#fileUploadService
          .upload(this.movieForm.controls.image.value!, link)
          .pipe(
            catchError(() => {
              throw new Error();
            })
          )
      ),
      catchError(() => {
        this.#toastrService.error('Wgrywanie obrazu nie powiodło się.');
        return of(null);
      })
    );
  }

  private uploadMovieMetadata({ title, description }: any): Observable<any> {
    return this.#movieMetadataService
      .uploadMovieMetadata(title, description)
      .pipe(
        catchError(() => {
          this.#toastrService.error('Wgrywanie metadanych nie powiodło się.');
          return of(false);
        })
      );
  }

  private createUserFilename(title: string, type: FileType): string {
    return `${title}_${type}_file`;
  }
}
