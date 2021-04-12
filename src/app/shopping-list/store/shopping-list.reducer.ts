import { Ingredients } from "../../shared/ingredient.model";
import * as ShoppingListActions from './shopping-list.action';

export interface State {
  ingredients: Ingredients[];
  editIngredient: Ingredients,
  editIngredientIndex: number;
}
export interface AppState {
  shoppingList: State;
}
const initialState = {
  ingredients:[
    new Ingredients('apple', 5),
    new Ingredients('tommato', 4),
  ],
  editIngredient: null,
  editIngredientIndex: -1
}
export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions){
 switch (action.type){
   case ShoppingListActions.ADD_INGREDIENT:
     return {
       ...state,
       ingredients: [...state.ingredients, action.payload]
     };
   case ShoppingListActions.ADD_INGREDIENTS:
     return {
       ...state,
       ingredients: [...state.ingredients, ...action.payload]
     };
   case ShoppingListActions.UPDATE_INGREDIENT:
    const ingredient = state.ingredients[state.editIngredientIndex];
    const updatedIngredient = {
      ...ingredient,
      ...action.payload
    }
     const updatedIngredients = [...state.ingredients];
     updatedIngredients[state.editIngredientIndex] = updatedIngredient;
     return {
      ...state,
      ingredients:updatedIngredients,
       editIngredientIndex: -1,
       editIngredient: null
    }
   case ShoppingListActions.DELETE_INGREDIENT:
     return {
       ...state,
       ingredients: state.ingredients.filter((id, idIndex) => {
         return idIndex !== state.editIngredientIndex;
       }),
       editIngredientIndex: -1,
       editIngredient: null
     }
   case ShoppingListActions.START_EDIT:
     return {
       ...state,
       editIngredientIndex: action.payload,
       editIngredient: {...state.ingredients[action.payload]}
     }
   case ShoppingListActions.STOP_EDIT:
     return {
       ...state,
       editIngredient: null,
       editIngredientIndex: -1
     }
   default:
       return state;
 }
}
