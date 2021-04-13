import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';
import { Subscription} from 'rxjs';
import {Ingredients} from '../../shared/ingredient.model';
import * as fromApp from '../../store/app.reducer';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredients;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe(stateData=> {
      if (stateData.editIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  // tslint:disable-next-line:typedef
  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredients(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }
  // tslint:disable-next-line:typedef
  onClear(){
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch( new ShoppingListActions.StopEdit());
  }
  // tslint:disable-next-line:typedef
  onDelete(){
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear();
  }
  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch( new ShoppingListActions.StopEdit());
  }
}
