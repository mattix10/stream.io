import { Component, Input } from '@angular/core';
import { MovieMetadata } from 'src/app/core/models/interfaces/movie-metadata';

@Component({
  selector: 'app-movie-metadata',
  standalone: true,
  templateUrl: './movie-metadata.component.html',
  styleUrl: './movie-metadata.component.scss',
})
export class MovieMetadataComponent {
  @Input() movieMetadata?: MovieMetadata;
}
