import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {environment} from '../../environments/environment';
import {Http, Headers} from '@angular/http';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private headers = new Headers({'Content-Type': 'application/json'});
  private serverUrl = environment.serverUrl + '/recipes/'; // URL to web api
  private recipes: Recipe[];

  constructor(private slService: ShoppingListService, private http: Http) {
  }

  getRecipes() {
    return this.http.get(this.serverUrl, {headers: this.headers})
      .toPromise()
      .then(response => {
        this.recipes = response.json().recipe as Recipe[];
        return response.json().recipe as Recipe[];
      })
      .catch(error => {
        return error;
      });
  }

  getRecipe(index: string) {
    if (index == null)
      return null;
    return this.http.get(this.serverUrl + index, {headers: this.headers})
      .toPromise()

      .then(response => {
        return response.json().recipe[0];
      })
      .catch(error => {

        return error;
      });
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    return this.http.post(this.serverUrl, recipe, {headers: this.headers})
      .toPromise()
      .then(response => {
        this.recipesChanged.next(this.recipes.slice());
      });
  }

  updateRecipe(index: string, newRecipe: Recipe) {
    return this.http.put(this.serverUrl + index, newRecipe, {headers: this.headers})
      .toPromise()
      .then(response => {
        this.recipesChanged.next(this.recipes.slice());
      });
  }

  deleteRecipe(index: string) {
    return this.http.delete(this.serverUrl + index, {headers: this.headers})
      .toPromise()
      .then(response => {
        this.recipesChanged.next(this.recipes.slice());
      });
  }
}
