import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { FollowService } from './follow.service';

describe('FollowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [FollowService]
    });
  });

  it('should be created', inject([FollowService], (service: FollowService) => {
    expect(service).toBeTruthy();
  }));
});
