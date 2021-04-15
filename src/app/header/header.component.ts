import {
  Component,
  OnInit,
  OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState> ) { }

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map(authStatus=>authStatus.user))
      .subscribe(user => {
      this.isAuth = !user ? false : true;
    })
  }
  onSaveData(){
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }
  onFetchData(){
    this.store.dispatch( new RecipesActions.FetchRecipe())
  }
  onLogOut(){
    this.store.dispatch(new AuthActions.LogOut());
  }
  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
