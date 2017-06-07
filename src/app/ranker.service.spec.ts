import { TestBed, inject } from '@angular/core/testing';

import { RankerService } from './ranker.service';

describe('RankerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RankerService]
    });
  });

  it('should be created', inject([RankerService], (service: RankerService) => {
    expect(service).toBeTruthy();
  }));
});
