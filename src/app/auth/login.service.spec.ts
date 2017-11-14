import { TestBed, inject, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { LoginService } from './login.service';
import { url } from '../resources';

const fetchMock = require('fetch-mock');

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [LoginService]
    });
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

  it('should login registered user and should not login unregistered user', async(inject([LoginService], (service: LoginService) => {
    service.getUsers().then(r => {

      // there should be 2 user from json file
      expect(r.length).toEqual(2);

      // login with registered user
      expect(service.login("nm1", "1-2-3")).toBeTruthy();

      // login with unregistered user
      expect(service.login("nm3", "0-0-0")).toBe(false, 'unregistered user cannot login');
    });
  })));

  it('should involve mocked requests when login', async(inject([LoginService], (service: LoginService) => {
    // should log in a user
    fetchMock.post(`${url}/login`, {"valid": "true"});
    service.mockLogin("nm1", "1-2-3")
      .then(_ => expect(service.validUser).toBe(true, 'login should recognize user as valid'));
    fetchMock.restore();
  })));
});
