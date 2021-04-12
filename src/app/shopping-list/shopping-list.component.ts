import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import { Store } from '@ngrx/store';

import {Ingredients} from '../shared/ingredient.model';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.action';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredients[] }>;
  constructor(private store: Store<fromShoppingList.AppState> ) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }
  // tslint:disable-next-line:typedef
  onEditItem(index: number){
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
  ngOnDestroy(): void {
  }
}
