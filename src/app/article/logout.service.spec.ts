import { TestBed, inject } from '@angular/core/testing';

import { LogoutService } from './logout.service';
import { url } from '../resources';

const fetchMock = require('fetch-mock');

describe('LogoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogoutService]
    });
  });

  it('should be created', inject([LogoutService], (service: LogoutService) => {
    expect(service).toBeTruthy();
  }));

  it('should log out a user and clear state', inject([LogoutService], (service: LogoutService) => {
  	localStorage.setItem("user", "test user"); // set a user
  	expect(localStorage.user).toBeDefined();

  	fetchMock.put(`${url}/logout`, {"sucess": "true"});
  	service.logout().then(r => {
  		expect(r).toBeTruthy(); // user should log out
  		expect(localStorage.user).toBeUndefined(); // state shuold be cleared
  	});
  	fetchMock.restore();
  }))
});
