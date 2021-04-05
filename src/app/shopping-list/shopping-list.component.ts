import { Component, OnInit } from '@angular/core';
import {Ingredients} from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredients[];
  constructor(private slServices: ShoppingListService) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.ingredients = this.slServices.getIngredients();
    this.slServices.ingredientChanged
      .subscribe(
        (ingredients: Ingredients[]) => {
          this.ingredients = ingredients;
        });
  }
}
