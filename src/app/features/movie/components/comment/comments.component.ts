import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieComment } from 'src/app/core/models/movie-comment';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent {
  @Input() comments?: MovieComment[];

  @Output() commentChanged = new EventEmitter<string>();

  onAddComment(comment: string): void {
    this.commentChanged.emit(comment);
  }
}
