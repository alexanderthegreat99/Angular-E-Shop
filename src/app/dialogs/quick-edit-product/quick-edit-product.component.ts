import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileUser } from 'src/app/models/user';
import { Observable, tap, Subscription, switchMap, of } from 'rxjs';
import { Firestore, collection, collectionData, where, query, } from '@angular/fire/firestore';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { HomeComponent } from 'src/app/components/home/home.component';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-quick-edit-product',
  templateUrl: './quick-edit-product.component.html',
  styleUrls: ['./quick-edit-product.component.css']
})
export class QuickEditProductComponent {
  myProduct: Product | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { myProduct: Product | undefined }, private firestore: Firestore, private productsService: ProductsService, private usersService: UsersService, private chatsService: ChatsService,) {
  }
  ngOnInit() {
    this.myProduct = this.data.myProduct;
   
  }
  
}
