import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Recipe } from '../recipes/recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';
import {take, map, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn:'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
      return this.store.select('recipes').pipe(
        take(1),
        map(recipesState=> {
          return recipesState.recipes;
        }),
        switchMap(recipes => {
          if(recipes.length === 0){
            this.store.dispatch(new RecipeActions.FetchRecipe());
            return this.actions$.pipe(
              ofType(RecipeActions.SET_RECIPES),
              take(1)
            );
          } else {
            return of(recipes);
          }
        })
      );
  }
}
