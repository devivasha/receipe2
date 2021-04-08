import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import {Ingredients} from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredients[];
  private idChangeSub: Subscription;
  constructor(private slServices: ShoppingListService) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.ingredients = this.slServices.getIngredients();
    this.idChangeSub = this.slServices.ingredientChanged
      .subscribe(
        (ingredients: Ingredients[]) => {
          this.ingredients = ingredients;
        });
  }
  // tslint:disable-next-line:typedef
  onEditItem(index: number){
    this.slServices.startedEditing.next(index);
  }
  ngOnDestroy(): void {
    this.idChangeSub.unsubscribe();
  }
}
