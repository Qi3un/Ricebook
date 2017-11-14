import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatButtonModule, MatFormFieldModule } from '@angular/material';
import { MatInputModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { HttpModule } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginService } from './login.service';
import { user } from './user';


function newEvent(eventName: string, bubbles = false, cancelable = false) {
    let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let loginService: LoginService;
  let spyLogin: jasmine.Spy;
  let testUsers: user[];
  let de: DebugElement;
  let nameEl: HTMLInputElement;
  let passwordEl: HTMLInputElement;
  let message: HTMLElement;
  let name, password;
  let mockRouter;
  let mockActivatedRoute;

  beforeEach(async(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockActivatedRoute = { component: "AuthComponent" };

    testUsers = [
      {
        id: 0,
        name: "tn1",
        disName: "test disName",
        email: "test@test.test",
        phone: "000-000-0000",
        birth: new Date("1000-10-10"),
        code: "00000",
        password: "0-0-0"
      }
    ];

    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        CustomFormsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
      ],
      providers: [
        LoginService,
        { provide: Router, useValue: mockRouter},
        { provide: ActivatedRoute, useValue: mockActivatedRoute}
      ],
      declarations: [ AuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    loginService = fixture.debugElement.injector.get(LoginService);
    spyLogin = spyOn(loginService, 'login').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoud create empty input for name and password', () => {
    de = fixture.debugElement.query(By.css('#loginName'));
    expect(de).not.toBe(null);

    de = fixture.debugElement.query(By.css('#loginPass'));
    expect(de).not.toBe(null);
  })

  it('shoue login as test user and navigate', () => {
    fixture.detectChanges();
    name = component.loginForm.controls['loginName'];
    password = component.loginForm.controls['loginPass'];

    name.setValue(testUsers[0].name);
    expect(name.valid).toBeTruthy();

    password.setValue(testUsers[0].password);
    expect(password.valid).toBeTruthy();

    component.verify(name.value, password.value);
    fixture.detectChanges();
    expect(component.validUser && component.loginForm.valid).toBe(true, 'test user is valid');

    // should navigate
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../article'], { relativeTo: mockActivatedRoute });
  })

  it('should update error message', fakeAsync(() => {
    fixture.detectChanges();
    const requiredError = "Please sign up if you don't have an account.";
    const namePatternError = "Name should be your NetID.";
    const pswPatternError = "Password should be like";
    const verifyError = "QAQ.. Seems the name or password you input is incorrect.";

    // update required error message
    setInput("", "#loginName");
    expect(getMessage("#nameMessage").indexOf(requiredError)).toBeGreaterThan(0);

    // update name pattern error message
    setInput("kkk", "#loginName");
    expect(getMessage("#nameMessage").indexOf(namePatternError)).toBeGreaterThan(0);

    // update password pattern error message
    setInput("nm1", "#loginName");
    setInput("000", "#loginPass");
    expect(getMessage("#pwdMessage").indexOf(pswPatternError)).toBeGreaterThan(0);

    // update verify error message
    component.validUser = false;
    setInput("1-2-3", "#loginPass");
    expect(getMessage("#verifyMessage").indexOf(verifyError)).toBeGreaterThan(0);
  }));

  it("shoud update success message", fakeAsync(() => {
    fixture.detectChanges();
    const successMessage = "You are ready to login!";

    component.validUser = true;
    setInput("nm1", "#loginName");
    setInput("1-2-3", "#loginPass");
    expect(getMessage("#successMessage").indexOf(successMessage)).toBeGreaterThan(0);
  }));

  function setInput(text: string, id: string){
    var el = fixture.debugElement.query(By.css(id)).nativeElement;
    el.value = text;
    el.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    tick();
  }

  function getMessage(id: string){
    de = fixture.debugElement.query(By.css(id));
    message = de.nativeElement;
    return message.textContent;
  }
});
