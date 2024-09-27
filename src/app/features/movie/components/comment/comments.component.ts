import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, take, tap } from 'rxjs';
import { MovieComment } from 'src/app/core/models/interfaces/movie-comment';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pl' }],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent {
  @Input() set contentComments(comments: MovieComment[]) {
    if (!comments?.length) return;

    this.comments = [
      ...comments!.sort(this.sortCommentsPredicate).map((com) => ({
        ...com,
      })),
    ];
  }

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

  comments?: MovieComment[];

  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$.pipe(take(1));

  onAddComment(comment: string): void {
    if (!comment) return;
    this.commentChanged.emit(comment);
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  private sortCommentsPredicate = (a: MovieComment, b: MovieComment): number =>
    new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime();
}
