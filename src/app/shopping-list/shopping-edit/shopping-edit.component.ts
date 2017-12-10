import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Params, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('f') slForm: NgForm;
  id: string;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  slForm: FormGroup;

  constructor(private slService: ShoppingListService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          console.log(this.id);
          this.editMode = params['id'] != null;
          this.editedItemIndex = params['id'];
          this.editedItem = this.slService.getIndiIngredient(params);
          this.initForm();
        }
      );
  }

  // onSubmit(form: NgForm) {
  //   // const value = form.value;
  //   // const newIngredient = new Ingredient(value.name, value.amount);
  //   if (this.editMode) {
  //     this.slService.updateIngredient(this.editedItemIndex, newIngredient);
  //   } else {
  //     this.slService.addIngredient(newIngredient);
  //   }
  //   this.editMode = false;
  //   form.reset();
  // }

  // onSubmit() {
  //   if (this.editMode) {
  //     this.slService.updateIngredient(this.id, this.slForm.value);
  //     console.log('dev mode staat aan dikzak')
  //   } else {
  //     console.log('Hallo, hierna wordt addingredient aangeroepen, groetjes')
  //     this.slService.addIngredient(this.slForm.value);
  //     console.log('Hallo, hiervoor werd addingredient aangeroepen, groetjes')

  //     // this.slService.getPosts()
  //     //   .then(recipes => {
  //     //     this.slService.postChanged.next(recipes.slice());
  //     //   });
  //   }
  //   // this.onCancel();
  // }

  onSubmit() {
    if (this.editMode) {
      this.slService.updateIngredient(this.id, this.slForm.value);
    } else {
      this.slService.addIngredient(this.slForm.value);
      this.slService.getIngredients()
        .then(ingredients => {
          this.slService.ingredientsChanged.next(ingredients);
        });
    }
    this.router.navigate(['/shopping-list']);
  }

  onClear() {
    // this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.id);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initForm() {
    let editingredient = new Ingredient({content: ''});

    if (this.editMode) {
      this.slService.getIndiIngredient(this.id)
        .then(ingredient => {
          editingredient = ingredient;
          this.slForm = new FormGroup({
            'name': new FormControl(editingredient.name, Validators.required),
            'amount': new FormControl(editingredient.amount, Validators.required)
            // 'imagePath': new FormControl(editrecipe.imagePath, Validators.required),
            // 'description': new FormControl(editrecipe.description, Validators.required),
            // 'ingredients': recipeIngredients
          });
        })
        .catch(error => {
          console.log(error);
          alert('Please make sure your form input is correct.');
        });
    }

    this.slForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'amount': new FormControl('', Validators.required)
      // 'comments': new FormControl('', Validators.required),
      // 'user': new FormControl('', Validators.required)
    });
  }

}
