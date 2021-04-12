import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import  { AuthService, AuthResponceData } from './auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import {  PlaceholderDirective } from '../shared/placeholder/placeholder.component'
@Component({
  selector:'app-auth',
  templateUrl:'./auth.component.html'
})
export class AuthComponent implements OnDestroy {
  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  onHandleError(){
    this.error = null;
  }
  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponceData>;
    this.isLoading = true;
    if (this.isLoginMode) {
      // @ts-ignore
      authObs = this.authService.logIn(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe(
      respData => {
        console.log(respData);
        this.isLoading = false;
        this.router.navigate(['./recipes'])
      }, error => {
        this.error = error;
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    );
    form.reset();
  }
  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostVievContainerRef = this.alertHost.viewContainerRef;

    hostVievContainerRef.clear();

    const componentRef = hostVievContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(()=> {
      this.closeSub.unsubscribe();
      hostVievContainerRef.clear();
    })
  }
  ngOnDestroy (){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }
}
