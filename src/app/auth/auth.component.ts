import { 
  Component, 
  ComponentFactoryResolver, 
  ViewChild, 
  OnDestroy, 
  OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import {  PlaceholderDirective } from '../shared/placeholder/placeholder.component'
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector:'app-auth',
  templateUrl:'./auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>
  ) {
  }

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSub: Subscription;
  private storeSub: Subscription;
  ngOnInit(){
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error){
        this.showErrorAlert(this.error)
      }
    })
  }

  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch( 
        new AuthActions.LogInStart({
          email: email,
          password: password})
      );
    } else {
      this.store.dispatch( 
        new AuthActions.SignupStart({
        email: email,
        password: password})
      );
    }
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
  onHandleError(){
   this.store.dispatch( new AuthActions.ClearError());
  }
  ngOnDestroy (){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
