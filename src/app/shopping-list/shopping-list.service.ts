import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Ingredients} from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientChanged = new Subject<Ingredients[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredients[] = [
    new Ingredients('apple', 5),
    new Ingredients('tommato', 4),
  ];
  constructor() { }
  // tslint:disable-next-line:typedef
  getIngredients(){
    return this.ingredients.slice();
  }
  // tslint:disable-next-line:typedef
  getIngredient(index: number){
   return this.ingredients[index];
  }
  // tslint:disable-next-line:typedef
  addIngredients(ingredient: Ingredients){
    this.ingredients.push(ingredient);
    this.ingredientChanged.next(this.ingredients.slice());
  }

  // tslint:disable-next-line:typedef
  addIngredients2(ingredients: Ingredients[]){
    // for (const ingredient of ingredients){
    //   this.addIngredients(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientChanged.next(this.ingredients.slice());
  }
  // tslint:disable-next-line:typedef
  updateIngredient(index: number, newIngredient: Ingredients) {
    this.ingredients[index] = newIngredient;
    this.ingredientChanged.next(this.ingredients.slice());
  }
  // tslint:disable-next-line:typedef
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientChanged.next(this.ingredients.slice());
  }
}
