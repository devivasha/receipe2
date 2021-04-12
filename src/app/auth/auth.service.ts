import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './user.model';


export interface AuthResponceData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tolenExpirationTimer: any;
  constructor(private http: HttpClient,
              private rourer: Router ) {
  }
  signUp(email: string, password: string ){
    return this.http.post<AuthResponceData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBt0JDs0riF8NrgpG3YbSBAhIII6WoempQ',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(resData => {
       this.handleAuthentication(
         resData.email,
         resData.localId,
         resData.idToken,
         +resData.expiresIn);
    }));
  }
  logIn(email: string, password: string ){
    return this.http.post<AuthResponceData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBt0JDs0riF8NrgpG3YbSBAhIII6WoempQ',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn);
    }));
  }
  autoLogin(){
    const userData:{
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;

    } = JSON.parse(localStorage.getItem('userData'));
  if (!userData){
    return;}
  const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
  if (loadedUser.token){
    this.user.next(loadedUser);
    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }
  }
  logOut(){
    this.user.next(null);
    this.rourer.navigate(['./auth']);
    localStorage.removeItem('userData');
    if (this.tolenExpirationTimer) {
      clearTimeout(this.tolenExpirationTimer);
    }
    this.tolenExpirationTimer = null;
  }
  autoLogout(expirationDuration: number){
    this.tolenExpirationTimer = setTimeout(()=>{
      this.logOut();
    }, expirationDuration);
  }
  private handleAuthentication(email:string, userId:string, token: string, expiresIn:number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user))
  }
  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return  throwError(errorMessage);
  }
}

