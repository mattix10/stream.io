import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
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
  tap,
} from 'rxjs';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DragAndDropUploadFileComponent } from '../drag-and-drop-upload-file/drag-and-drop-upload-file.component';
import { LicenseRulesFormComponent } from '../license-rules-form/license-rules-form.component';
import { FileType } from '../../models/file-type';
import { ContentService } from 'src/app/core/services/content.service';
import { LinkForUploadFileResponse } from 'src/app/core/models/responses/link-for-upload-file-response';
import { Response } from 'src/app/core/models/responses/response';
import { isLoading } from 'src/app/core/models/interfaces/loading';
import { FileUploadService } from '../../services/file-upload.service';
import { UserContentMetadata } from 'src/app/core/models/interfaces/user-content-metadata';
import { LicenseRule } from 'src/app/core/models/interfaces/license-rule';
import { ImageFileId } from '../../models/image-file-id';
import { VideoFileId } from '../../models/video-file-id';

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
    this.#isEditMode = isEditMode;
    this.uploadImageTemplate?.removeFile();
    this.uploadMovieTemplate?.removeFile();

    if (!isEditMode) {
      this.movieForm.reset();
    }

    this.manageFormValidators();
  }

  get isEditMode(): boolean {
    return this.#isEditMode;
  }

  @Input() set contentMetadata(contentMetadata: UserContentMetadata | null) {
    if (!contentMetadata) return;

    this.#contentMetadata = contentMetadata;
    const { title, description, licenseRules } = contentMetadata;

    this.licenseRules = licenseRules;
    this.movieForm.patchValue({
      title,
      description,
      image: null,
      movie: null,
    });

    this.uploadImageTemplate?.removeFile();
    this.uploadMovieTemplate?.removeFile();
  }

  @Output() submitFormChanged = new EventEmitter();

  @ViewChild('uploadImageTemplate')
  uploadImageTemplate!: DragAndDropUploadFileComponent;

  @ViewChild('uploadMovieTemplate')
  uploadMovieTemplate!: DragAndDropUploadFileComponent;

  submit = new Subject<void>();

  movieForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl<File | null>(null),
    movie: new FormControl<File | null>(null),
  });
  licenseRules: LicenseRule[] = [];
  clearLicenseRules = new Subject<void>();

  isLoading: boolean = false;
  #isEditMode = false;

  readonly fileType = FileType;
  readonly #fileUploadService = inject(FileUploadService);
  readonly #contentService = inject(ContentService);

  #contentMetadata?: UserContentMetadata;

  get title() {
    return this.movieForm.get('title');
  }

  get description() {
    return this.movieForm.get('description');
  }

  onUploadImage(file: File): void {
    this.movieForm.controls.image.patchValue(file);
  }

  onUploadVideo(file: File): void {
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
    this.movieForm.markAllAsTouched();

    if (this.movieForm.invalid) return;

    this.submit.next();
    this.isLoading = true;

    const contentMetadataRequest = {
      title: this.movieForm.value.title as string,
      description: this.movieForm.value.description as string,
      licenseRules: this.licenseRules,
    };

    if (this.#isEditMode) {
      this.updateMovie(contentMetadataRequest);
      return;
    }

    this.addMovie(contentMetadataRequest);
  }

  private updateMovie(contentMetadataForm: {
    title: string;
    description: string;
    licenseRules: LicenseRule[];
  }): void {
    this.#contentService
      .updateContent(contentMetadataForm, this.#contentMetadata!.uuid)
      .pipe(
        tap(() => {
          this.movieForm.reset();
          this.submitFormChanged.emit();
          this.clearLicenseRules.next();
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  private addMovie(contentMetadataForm: {
    title: string;
    description: string;
    licenseRules: LicenseRule[];
  }): void {
    forkJoin([this.uploadImage(), this.uploadVideo()])
      .pipe(
        mergeMap(([imageResponse, movieResponse]) => {
          const contentMetadataRequest = {
            imageFileId: imageResponse.result.imageFileId,
            videoFileId: movieResponse.result.videoFileId,
            ...contentMetadataForm,
          };
          return this.#contentService.createContent(contentMetadataRequest);
        }),
        tap(() => {
          this.clearLicenseRules.next();
          this.movieForm.reset();
          this.submitFormChanged.emit();
          this.uploadImageTemplate.removeFile();
          this.uploadMovieTemplate.removeFile();
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  private uploadVideo(): Observable<Response<VideoFileId>> {
    const movieFile = this.movieForm.get('movie')?.value;

    if (!movieFile) return EMPTY;

    return this.#fileUploadService
      .getVideoLink()
      .pipe(
        mergeMap(({ result }: LinkForUploadFileResponse) =>
          this.#fileUploadService.upload<VideoFileId>(movieFile, result.url)
        )
      );
  }

  private uploadImage(): Observable<Response<ImageFileId>> {
    const imageFile = this.movieForm.get('image')?.value;

    if (!imageFile) return EMPTY;

    return this.#fileUploadService
      .getImageLink()
      .pipe(
        mergeMap(({ result }: LinkForUploadFileResponse) =>
          this.#fileUploadService.upload<ImageFileId>(imageFile, result.url)
        )
      );
  }

  private manageFormValidators(): void {
    const formFields = ['image', 'movie'];

    formFields.forEach((fieldName) => {
      this.#isEditMode
        ? this.movieForm.get(fieldName)?.removeValidators(Validators.required)
        : this.movieForm.get(fieldName)?.addValidators(Validators.required);
      this.movieForm.get(fieldName)?.updateValueAndValidity();
    });
  }
}
