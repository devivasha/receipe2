import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;
  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recepies: Recipe[]) => {
        this.recipes = recepies;
      });
    this.recipes = this.recipeService.getRecipes();
  }
  // tslint:disable-next-line:typedef
  onNewRecipe(){
   this.router.navigate(['new'], {relativeTo: this.route});
  }
  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
