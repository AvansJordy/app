import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
   subscription: Subscription;

  constructor(private slService: ShoppingListService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('init list aangeroepen');
    this.subscription = this.slService.ingredientsChanged
      .subscribe(
        (params: Params) => {
          this.slService.getIngredients().then(res => {
            this.ingredients = res;
            console.log('lekkah bezig pikke');
            console.dir(res);
          });
        }
      );


    this.slService.getIngredients().then(res => {
      this.ingredients = res;
    });
  }

  onEditItem(index: string) {
    console.log('onEditItem aangeroepen ' + index);
    // this.slService.updateIngredient(index, ingredient);
    this.router.navigate(['/shopping-list/' + index + '/edit']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
