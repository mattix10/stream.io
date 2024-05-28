import { TestBed } from '@angular/core/testing';

import { MovieMetadataService } from './movie-metadata.service';

describe('MovieMetadataService', () => {
  let service: MovieMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieMetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
