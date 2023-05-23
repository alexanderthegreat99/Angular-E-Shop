import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { DialogService } from 'src/app/services/dialog.service';
import { UsersService } from 'src/app/services/users.service';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import {
  map,
  reduce,
  tap
} from 'rxjs';
import { CartItem } from 'src/app/models/cart-item';
@UntilDestroy()
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  //allProducts$ = this.productsService.allProducts$;
  user$ = this.usersService.currentUserProfile$;
  getMyCart$ = this.shoppingCartService.getMyCart$;
  userCart: CartItem[] = [];
  allProducts: Product[] = [];
  p: number = 1;

  constructor(private productsService: ProductsService, private dialogService: DialogService, private usersService: UsersService, private shoppingCartService: ShoppingCartService) {}
  
  ngOnInit() {
    // this.getMyCart$.pipe(
    //   map(cartItems => cartItems.forEach(cartItem=> cartItem.products?.forEach(product=> {
    //     if(product.productId ==="FTl5HnGZUKznRNoFALet") {console.log("true");return true}else{
    //       console.log("false")
    //       return false
    //     }})))
    // ).subscribe();
    // this.getMyCart$.pipe(untilDestroyed(this)).subscribe(
    //   userCarts => {
    //     userCarts.forEach((userCart)=>{
    //       userCart.products?.forEach((product)=>
    //       this.userCart.push(product)
        
    //       )
    //     })
    //     console.log("userCart",this.userCart)
    //   },
    //   error => console.log('error fetching products', error)
    // );
    // this.getMyCart$.pipe(untilDestroyed(this)).subscribe(
    //   userCarts => {
    //     userCarts.forEach((userCart) => {
    //       userCart.products?.forEach((product) => {
    //         const isProductExists = this.userCart.some(item => item.productId === product.productId);
    //         if (!isProductExists) {
    //           this.userCart.push(product);
    //         }
    //       });
    //     });
    //     console.log("userCart", this.userCart);
    //   },
    //   error => console.log('Error fetching products', error)
    // );
    this.getMyCart$.pipe(untilDestroyed(this)).subscribe(
      userCarts => {
        userCarts.forEach((userCart) => {
          userCart.products?.forEach((product) => {
            const isProductExists = this.userCart.some(item => item.productId === product.productId);
            if (!isProductExists) {
              this.userCart.push(product);
            }
          });
        });
        console.log(this.userCart.length," length")
    
        // Remove items from userCart that are not in getMyCart
        this.userCart = this.userCart.filter(item =>
          userCarts.some(userCart => userCart.products?.some(product => product.productId === item.productId))
        );
    
        console.log("userCart", this.userCart);
      },
      error => console.log('Error fetching products', error)
    );
    // this.getMyCart$.pipe(
    //   map(cartItems => cartItems.some(cartItem => {
    //     return cartItem.products?.some(product => {
    //       if (product.productId === "FTl5HnGZUKznRNoFALet") {
    //         console.log("true");
    //         return true;
    //       } else {
    //         console.log("false");
    //         return false;
    //       }
    //     });
    //   }))
    // ).subscribe(result => {
    //   // Use the result as needed
    // });

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
      console.log(`Editing Product with ID ${myProduct.productId}`);
    } else {
      console.log("User IDs not available");
    }
    this.dialogService.quickEditProduct(myProduct);
  }
  addToCart(userId:string,productId: string, cartItemId: string){
  //  this.shoppingCartService.addToCart$(userId).pipe(untilDestroyed(this)).subscribe(
  //   result => {
      
  //     console.log('success! result: ', result )
  //   },
  //   error => console.log('error adding item to cart', error)
  // );
  this.shoppingCartService.updateCart(cartItemId,productId);
  this.shoppingCartService.getMyCart$.pipe(untilDestroyed(this)).subscribe(
    result => {
      
           console.log('success! my cart contains: ', result )
        },
        error => console.log('error adding item to cart', error)
  );
  }
  
  isProductInCart1(productId: string) {
    //   this.getMyCart$.pipe(
    //   map(cartItems => cartItems.forEach(cartItem=> cartItem.products?.forEach(product=> {
    //     if(product.productId ===productId) {console.log("true");return true}else{
    //       console.log("false")
    //       return false
    //     }})))
    // ).pipe(untilDestroyed(this)).subscribe();
  }
  isProductInCart(productId:string){
    const isProductExists = this.userCart.some(item => item.productId === productId);
    return isProductExists;
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
