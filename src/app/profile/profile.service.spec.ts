import { TestBed, inject } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { url } from '../resources';
import { user } from '../auth/user';

const fetchMock = require('fetch-mock');

describe('ProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService]
    });
  });

  it('should be created', inject([ProfileService], (service: ProfileService) => {
    expect(service).toBeTruthy();
  }));

  it('should fetch user\'s profile information', inject([ProfileService], (service: ProfileService) => {
    const testUser: user = {
      "id": 111,
      "name": "test user",
      "disName": "test disName",
      "email": "test@test.test",
      "phone": "000-000-0000",
      "birth": new Date("1000-10-10T00:00:00.000Z"),
      "code": "00000",
      "password": "0-0-0"
    };
    fetchMock.get(`${url}/profile`, {"user": testUser});

    service.fetchProfile(111)
      .then(r => expect(r).toEqual(testUser));

    fetchMock.restore();
  }));
});
