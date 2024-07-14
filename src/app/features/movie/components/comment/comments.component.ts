import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

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

  ngOnInit(): void {
    this.comments = this.comments?.map((com) => ({
      ...com,
      body: this.domSanitizer.bypassSecurityTrustHtml(com.body) as string,
    }));
    this.#authService.isLoggedIn$.subscribe((data) => console.log(data));
    this.isLoggedIn$ = this.#authService.isLoggedIn$;
  }

  onAddComment(comment: string): void {
    if (!comment) return;
    this.commentChanged.emit(comment);
  }
}
