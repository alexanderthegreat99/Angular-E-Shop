import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { DialogService } from 'src/app/services/dialog.service';
import { UsersService } from 'src/app/services/users.service';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  //allProducts$ = this.productsService.allProducts$;
  user$ = this.usersService.currentUserProfile$;
  allProducts: Product[] = [];
  p: number = 1;

  constructor(private productsService: ProductsService, private dialogService: DialogService, private usersService: UsersService) {}
  
  ngOnInit() {
    this.productsService.allProducts$.pipe(untilDestroyed(this)).subscribe(
      products => {
        this.allProducts = products;
        //console.log('products', products); // Log the fetched products to the console
      },
      error => console.log('error fetching products', error)
    );
    // this.usersService.allUsers$.pipe(untilDestroyed(this)).subscribe(
    //   users => {
        
    //     console.log('all user query, in products component  ngoninit ', users); // Log the fetched products to the console
    //   },
    //   error => console.log('error fetching users', error)
    // );
   
   // this.usersService.specificUser$.subscribe(users => console.log("users test: ", (users)));
    
  }
  onPageChange(pageNumber: number) {
    this.p = pageNumber;
    this.productsService.updateP(this.p);
  }
  messageSeller(userIds: string | undefined){
    if (userIds) {
      console.log(`Sending message to user with IDs ${userIds}`);
    } else {
      console.log("User IDs not available");
    }
    this.dialogService.quickMessageDialog(userIds);
  }
  quickEditProduct(myProduct: Product | undefined){
    if (myProduct) {
      console.log(`Editing Product with ID ${myProduct.id}`);
    } else {
      console.log("User IDs not available");
    }
    this.dialogService.quickEditProduct(myProduct);
  }
}

//   createChat(otherUser:ProfileUser){
//     this.chatsService.isExistingChat(otherUser.uid).pipe(
//      switchMap(chatId => {
//        if (chatId){
//          return of(chatId);
//        }else {
//          return this.chatsService.createChat(otherUser);
//        }
//      })
//     ).subscribe(chatId => {
//      this.chatListControl.setValue([chatId]);
//     })
//  }
// sendMessage(){
//  const message = this.messageControl.value;
//  const selectedChatId =this.chatListControl.value[0];
 
//  if (message && selectedChatId){
//    this.chatsService.addChatMessage(selectedChatId, message).subscribe(
//      () => {
//        this.scrollToBottom();
//      }
//    );
//    this.messageControl.setValue('');
//  }
// }
