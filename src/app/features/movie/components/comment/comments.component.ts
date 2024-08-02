import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, take, tap } from 'rxjs';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pl' }],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  @Input() comments?: MovieComment[];

  @Input() set submitComment(submit: Subject<void>) {
    submit
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap(() => {
          this.comment!.nativeElement.value = '';
          this.autoResize(this.comment!.nativeElement!);
        })
      )
      .subscribe();
  }

  @ViewChild('comment') comment?: ElementRef;
  @Output() commentChanged = new EventEmitter<string>();

  domSanitizer = inject(DomSanitizer);

  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$.pipe(take(1));

  ngOnInit(): void {
    this.comments = this.comments?.map((com) => ({
      ...com,
      body: this.domSanitizer.bypassSecurityTrustHtml(com.body) as string,
    }));
  }

  onAddComment(comment: string): void {
    if (!comment) return;
    this.commentChanged.emit(comment);
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
