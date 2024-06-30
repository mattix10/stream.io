import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  catchError,
  combineLatest,
  EMPTY,
  finalize,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { FileUploadService } from 'src/app/features/user-dashboard/services/file-upload-service/file-upload.service';
import { MovieMetadataService } from 'src/app/features/user-dashboard/services/movie-metadata-service/movie-metadata.service';
import { ToastrService } from 'ngx-toastr';
import { isLoading } from 'src/app/features/auth/models/loading';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { LicenseRule } from 'src/app/core/models/license-rule';
import { UploadContentMetadataRequest } from 'src/app/core/models/requests/upload-movie-metadata-request';
import { DragAndDropUploadFileComponent } from '../drag-and-drop-upload-file/drag-and-drop-upload-file.component';
import { LicenseRulesFormComponent } from '../license-rules-form/license-rules-form.component';
import { FileType } from '../../models/file-type';
import { UserContentMetadata } from 'src/app/core/models/user-content-metadata-response';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragAndDropUploadFileComponent,
    SpinnerComponent,
    LicenseRulesFormComponent,
  ],
  templateUrl: './movie-form.component.html',
  providers: [MovieMetadataService, FileUploadService],
})
export class MovieFormComponent implements isLoading {
  @Input({ required: true }) set isEditMode(isEditMode: boolean) {
    this._isEditMode = isEditMode;
    if (!this._isEditMode) this.movieForm.reset();
  }

  @Input() set contentMetadata(contentMetadata: UserContentMetadata | null) {
    if (contentMetadata) {
      this.movieForm.patchValue({
        title: contentMetadata.title,
        description: contentMetadata.description,
        image: this.createUserFilename(contentMetadata.title, FileType.Image),
        movie: this.createUserFilename(contentMetadata.title, FileType.Movie),
      });
    }
  }

  submit = new Subject<void>();

  movieForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl(),
    movie: new FormControl(),
  });
  licenseRules: LicenseRule[] = [];

  isLoading: boolean = false;
  private contentId: string = '';
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

  onRulesChanged(licenseRules: LicenseRule[]): void {
    this.licenseRules = licenseRules;
  }

  onSubmit(): void {
    this.submit.next();

    // if (this.movieForm.invalid) return;

    console.log(this.movieForm);

    this.isLoading = true;

    if (this.isEditMode) {
      // TODO: Implement editing
    } else {
      const contentMetadataRequest: UploadContentMetadataRequest = {
        title: this.movieForm.value.title as string,
        description: this.movieForm.value.description as string,
        licenseRules: this.licenseRules,
      };

      this.uploadContentMetadata(contentMetadataRequest)
        .pipe(
          switchMap(({ contentId }: { contentId: string }) => {
            if (contentId) {
              this.contentId = contentId;

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

    return this.#fileUploadService.getLinkForUploadMovie(this.contentId).pipe(
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

    return this.#fileUploadService.getLinkForUploadImage(this.contentId).pipe(
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

  private uploadContentMetadata(
    contentMetadataRequest: UploadContentMetadataRequest
  ): Observable<any> {
    return this.#movieMetadataService
      .uploadContentMetadata(contentMetadataRequest)
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
