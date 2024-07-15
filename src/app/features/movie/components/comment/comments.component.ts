import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  @Input() comments?: MovieComment[];

  @Output() commentChanged = new EventEmitter<string>();
  domSanitizer = inject(DomSanitizer);

  isLoggedIn$: Observable<boolean> = of(false);

  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.comments = this.comments?.map((com) => ({
      ...com,
      body: this.domSanitizer.bypassSecurityTrustHtml(com.body) as string,
    }));
    this.#authService.isLoggedIn$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((data) => console.log(data));
    this.isLoggedIn$ = this.#authService.isLoggedIn$;
  }

  onAddComment(comment: string): void {
    if (!comment) return;
    this.commentChanged.emit(comment);
  }
}
