import { Injectable, EventEmitter } from '@angular/core';
import {Ingredients} from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientChanged = new EventEmitter<Ingredients[]>();
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
  addIngredients(ingredient: Ingredients){
    this.ingredients.push(ingredient);
    this.ingredientChanged.emit(this.ingredients.slice());
  }

  // tslint:disable-next-line:typedef
  addIngredients2(ingredients: Ingredients[]){
    // for (const ingredient of ingredients){
    //   this.addIngredients(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientChanged.emit(this.ingredients.slice());
  }
}
