import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  // @ts-ignore
  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState> ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.store.select('recipes').pipe(map(recipesState => {
            return recipesState.recipes.find((recipe, index)=>{
              return index === this.id;
            });
          })
          ).subscribe(recipe=>{
            this.recipe = recipe;
          })
        });
  }
  // tslint:disable-next-line:typedef
  onAddToShoppingList(){
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  // tslint:disable-next-line:typedef
  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route})

  }
  // tslint:disable-next-line:typedef
  onDeleteRecipe(){
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
