import {
  Component,
  OnInit,
  OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {Recipe} from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private sroteSub: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  // tslint:disable-next-line:typedef
  ngOnInit(){
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        });
  }
  // tslint:disable-next-line:typedef
  onSubmit(){
    if (this.editMode){
      this.store.dispatch( new RecipesActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value}))
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }
  // tslint:disable-next-line:typedef
  onAddIngredient(){
    (<FormArray> this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }
  // tslint:disable-next-line:typedef
  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode){
    this.sroteSub =  this.store.select('recipes').pipe(map(recipeState=> {
        return recipeState.recipes.find((recipe, index)=>{
          return index === this.id;
        })
      })
      ).subscribe(recipe=>{
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients){
            recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ingredient.name),
                amount: new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          }
        }
      })
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }
  // tslint:disable-next-line:typedef
  get controls(){
    return (<FormArray> this.recipeForm.get('ingredients')).controls;

  }
  // tslint:disable-next-line:typedef
  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});

  }
  // tslint:disable-next-line:typedef
  onDeleteIngredient(index: number){
    (<FormArray> this.recipeForm.get('ingredients')).removeAt(index);
  }
  ngOnDestroy(){
    if (this.sroteSub){
      this.sroteSub.unsubscribe();
    }
  }

}
