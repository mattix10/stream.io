import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  EMPTY,
  finalize,
  forkJoin,
  mergeMap,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { isLoading } from 'src/app/features/auth/models/loading';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { LicenseRule } from 'src/app/core/models/license-rule';
import { UploadContentMetadataRequest } from 'src/app/core/models/requests/upload-movie-metadata-request';
import { DragAndDropUploadFileComponent } from '../drag-and-drop-upload-file/drag-and-drop-upload-file.component';
import { LicenseRulesFormComponent } from '../license-rules-form/license-rules-form.component';
import { FileType } from '../../models/file-type';
import { FileUploadService } from '../../services/file-upload-service/file-upload.service';
import { UserContentMetadata } from 'src/app/core/models/responses/user-content-metadata-response';
import { ContentService } from 'src/app/core/services/content.service';
import { UploadContentMetadataResponse } from 'src/app/core/models/responses/upload-content-metadata-response';
import { LinkForUploadFileResponse } from 'src/app/core/models/responses/link-for-upload-file-response';
import { LoggerService } from 'src/app/core/services/logger.service';

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
  providers: [FileUploadService],
})
export class MovieFormComponent implements isLoading {
  @Input({ required: true }) set isEditMode(isEditMode: boolean) {
    this._isEditMode = isEditMode;

    if (!this._isEditMode) this.movieForm.reset();
  }

  @Input() set contentMetadata(contentMetadata: UserContentMetadata | null) {
    if (!contentMetadata) return;

    const { title, description, licenseRules } = contentMetadata;

    this.licenseRules = licenseRules;
    this.movieForm.patchValue({
      title,
      description,
      image: this.createUserFilename(title, FileType.Image),
      movie: this.createUserFilename(title, FileType.Movie),
    });
  }

  @Output() submitFormChanged = new EventEmitter();

  submit = new Subject<void>();

  movieForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    // TODO: remove any
    image: new FormControl<any>('', Validators.required),
    movie: new FormControl<any>('', Validators.required),
  });
  licenseRules: LicenseRule[] = [];

  isLoading: boolean = false;
  _isEditMode = false;

  readonly fileType = FileType;
  readonly #fileUploadService = inject(FileUploadService);
  readonly #contentService = inject(ContentService);
  readonly #toastrService = inject(ToastrService);
  readonly #loggerService = inject(LoggerService);
  #contentId: string = '';

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
    console.log(this.movieForm);

    if (this.movieForm.invalid) return;

    this.isLoading = true;

    const contentMetadataRequest: UploadContentMetadataRequest = {
      title: this.movieForm.value.title as string,
      description: this.movieForm.value.description as string,
      licenseRules: this.licenseRules,
    };
    const call = this.isEditMode
      ? this.updateContentMetadata(contentMetadataRequest)
      : this.createContentMetadata(contentMetadataRequest);

    call
      .pipe(
        switchMap(({ result }) => {
          if (result.contentId) {
            this.#contentId = result.contentId;
            this.#toastrService.success('Metadane zostały wgrane pomyślnie.');

            return forkJoin([this.uploadImage(), this.uploadMovie()]);
          }

          return EMPTY;
        }),
        tap((results) => {
          if (results) {
            const [uploadMovieResult, uploadImageResult] = results;

            if (uploadMovieResult) {
              this.#toastrService.success('Film został wgrany pomyślnie');
            }
            if (uploadImageResult) {
              this.#toastrService.success('Obraz został wgrany pomyślnie');
            }
          }

          this.submitFormChanged.emit();
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  private uploadMovie(): Observable<LinkForUploadFileResponse> {
    const movieFile = this.movieForm.get('movie')?.value;

    if (!movieFile) return EMPTY;

    return this.#fileUploadService
      .getLinkForUploadMovie(this.#contentId)
      .pipe(
        mergeMap(({ result }: LinkForUploadFileResponse) =>
          this.#fileUploadService.upload(movieFile, result.url)
        )
      );
  }

  private uploadImage(): Observable<LinkForUploadFileResponse> {
    const imageFile = this.movieForm.get('image')?.value;

    if (!imageFile) return EMPTY;

    return this.#fileUploadService
      .getLinkForUploadImage(this.#contentId)
      .pipe(
        mergeMap(({ result }: LinkForUploadFileResponse) =>
          this.#fileUploadService.upload(imageFile, result.url)
        )
      );
  }

  private updateContentMetadata(
    contentMetadataRequest: UploadContentMetadataRequest
  ): Observable<UploadContentMetadataResponse> {
    return this.#contentService.updateContent(
      contentMetadataRequest,
      this.contentMetadata!.uuid
    );
  }

  private createContentMetadata(
    contentMetadataRequest: UploadContentMetadataRequest
  ): Observable<UploadContentMetadataResponse> {
    return this.#contentService.createContent(contentMetadataRequest);
  }

  private createUserFilename(title: string, type: FileType): string {
    return `${title}_${type}_file`;
  }
}
