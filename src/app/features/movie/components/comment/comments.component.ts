import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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

  isLoggedIn$: Observable<boolean> = of(false);

  readonly #authService = inject(AuthService);

  ngOnInit(): void {
    this.#authService.isLoggedIn$.subscribe((data) => console.log(data));
    this.isLoggedIn$ = this.#authService.isLoggedIn$;
  }

  onAddComment(comment: string): void {
    if (!comment) return;
    this.commentChanged.emit(comment);
  }
}
