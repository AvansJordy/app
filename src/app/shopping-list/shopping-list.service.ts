import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs/Subject';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map'

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private headers = new Headers({'Content-Type': 'application/json'});
  private serverUrl = environment.serverUrl + '/ingredients/'; // URL to web api
  private ingredients: Ingredient[];

  constructor(private http: Http) {
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  // getIngredients() {
  //   // return this.ingredients.slice();
  // }

  // getIngredient(index: number) {
  //   return this.ingredients[index];
  // }

  // getRecipes() {
  //   return this.http.get(this.serverUrl, {headers: this.headers})
  //     .toPromise()
  //     .then(response => {
  //       this.recipes = response.json().recipe as Recipe[];
  //       return response.json().recipe as Recipe[];
  //     })
  //     .catch(error => {
  //       return error;
  //     });
  // }

  getIngredients() {
    return this.http.get(this.serverUrl, {headers: this.headers})
        .toPromise()
        .then(response => {
          this.ingredients = response.json().ingredients as Ingredient[];
          return response.json().ingredients as Ingredient[];
        })
        .catch(error => {
          return error;
        });
  }

  private readIngredient()
  {
    this.http.get(environment.serverUrl + '/ingredients')
    .map((response: Response) => {
      console.log('map');
      const ingredients: Ingredient[] = response.json();
      return ingredients;
    })
    .subscribe((ingredients: Ingredient[]) => {
      console.log('subscribe');
      this.ingredients = ingredients;
      console.dir(this.ingredients);
      // this.ingredientsChanged.next(this.ingredients.slice());
    });
  }

  getIndiIngredient(index: string) {
    if (index == null) {
      console.log('null');
      return null;
    }
    return this.http.get(this.serverUrl + index, {headers: this.headers})
      .toPromise()
      .then(response => {
        return response.json()[0] as Ingredient;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  private handleError(error: any): Promise<any> {
    console.log('handleError');
    return Promise.reject(error.message || error);
  }

  // addIngredients(ingredients: Ingredient[]) {
  //   // for (let ingredient of ingredients) {
  //   //   this.addIngredient(ingredient);
  //   // }
  //   this.ingredients.push(...ingredients);
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  // updateIngredient(index: number, newIngredient: Ingredient) {
  //   this.ingredients[index] = newIngredient;
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  // deleteIngredient(index: number) {
  //   this.ingredients.splice(index, 1);
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  // addIngredient(ingredient: Ingredient) {
  //   this.http.post(environment.serverUrl + '/ingredients', ingredient)
  //     .map((response: Response) => {
  //       const ingredients: Ingredient = response.json();
  //       return ingredients;
  //     })
  //     .subscribe((ingredient: Ingredient) => {
  //       this.ingredients.push(ingredient);
  //       this.ingredientsChanged.next(this.ingredients.slice());
  //     });
  // }
    addIngredient(ingredient: Ingredient) {
  console.log('addIngredient aangeroepen');
  return this.http.post(this.serverUrl, ingredient, {headers: this.headers})
    .toPromise()
    .then(response => {
      console.dir(response);
      console.log('Kut jong');
      this.ingredientsChanged.next(this.ingredients);
    });
}
  //
  // addIngredients(ingredient: Ingredient) {
  //
  //     this.http.post(environment.serverUrl + '/ingredients/', ingredients)
  //
  //   // this.ingredients.push(...ingredients);
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  updateIngredient(index: string, newIngredient: Ingredient) {
    this.http.put(environment.serverUrl + '/ingredients/' + this.ingredients[index]._id, newIngredient)
    .map((response: Response) => {
      const ingredients: Ingredient = response.json();
      return ingredients;
    })
    .subscribe((ingredient: Ingredient) => {
      this.ingredients[index] = newIngredient;
      this.ingredientsChanged.next(this.ingredients);
    });
  }

  deleteIngredient(index: string) {
    this.http.delete(environment.serverUrl + '/ingredients/' + this.ingredients[index]._id)
    .map((response: Response) => {
      const ingredients: Ingredient = response.json();
      return ingredients;
    })
    .subscribe((ingredient: Ingredient) => {
      this.ingredientsChanged.next(this.ingredients.slice());
    });
  }

}
