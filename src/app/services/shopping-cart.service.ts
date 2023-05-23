import { Injectable, OnInit } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  collectionData,
  where,
  updateDoc,
  getDoc,
  arrayUnion, 
  arrayRemove 
  
} from '@angular/fire/firestore';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

//import { UsersService } from './users.service';
import { map, Observable, from, concatMap, take, switchMap, throwError,combineLatest, tap} from 'rxjs';
import { UsersService } from './users.service';
//import { Product } from '../models/product';
import { myCart, CartItem, newCartItem} from '../models/cart-item';
import { Product } from 'src/app/models/product';
//import { Product } from '../models/product';
import { ProductsService } from 'src/app/services/products.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService implements OnInit{
  allProducts: Product[] = [];
  allProducts$ = this.productsService.allProducts$;
 // userCartNew: CartItem[] = [];
  productWithDetailsLength: number = 0;
  

  
  combinedStreamNew$ = combineLatest([
    this.getMyCart$,
    this.allProducts$,
  ]).pipe(
    map(([userCarts, products]) => {
      return userCarts.map((userCart) => {
    //    console.log("usercart: ", userCart.products);
    //    console.log("all products: ",products);
        const productsWithDetails: newCartItem[] = [];
        var product1: Product;
        userCart.products?.forEach((cartItem) => {
          products.forEach((product) => {
       //   console.log("hi cartitem ", cartItem);
       //   console.log("products ", product);
         
      //  console.log("product id ", product.productId);
//console.log("cartItem id ", cartItem.productId);
        if (product.productId === cartItem.productId) {
         product1 = product;
         // console.log(product1)
        //  console.log('Condition is true!');
        //  console.log('product: ', product);
          //console.log('cartItem ', 'cartitemid: ', cartItem);
          
        
          
          const productWithDetail: newCartItem = {
            quantity: cartItem.quantity,
            product: product1,
          };
        
          productsWithDetails.push(productWithDetail);
        //  console.log("productWithDetail",productWithDetail)
          //this.productsArray.push(productWithDetail);
        }
        });
        });
        
       // console.log("productsWithDetails: ", productsWithDetails.length);
        this.productWithDetailsLength=productsWithDetails.length;
    
        return {
          ...userCart,
          products: productsWithDetails,
        };
      });
    }),
    tap((data) => {
     // console.log("data :", data);
    })
  );

  constructor(private firestore: Firestore, private usersService: UsersService, private productsService:ProductsService) { }

  createCart(userId: string): Observable<any> {
    const ref = collection(this.firestore, 'carts');
    const data = {
      
      
      userId: userId,
    };
    return from(addDoc(ref, data));
  }

  get getMyCart$(): Observable<myCart[]>{
    const ref = collection(this.firestore, 'carts')
    return this.usersService.currentUserProfile$.pipe(
      concatMap((user)=> {
        const myQuery = query(ref, where('userId', '==', user?.uid))
        return collectionData(myQuery, {idField: 'id'}) as Observable<myCart[]>
      })
    )
  }

  addToCart(): Observable<any> {
    
    const chatRef = doc(this.firestore, 'carts', 'qxt0MTFPk7TBkiWJjUg3');
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap(() =>{
      return from(updateDoc(chatRef, { testField: true }));
  })
    );
  }
  updateCart1(cartItemId:string, productId:string ): Observable<any> {
    const ref = doc(this.firestore, 'carts', cartItemId);
    const updateObj= { 
      
      products:{
        productId: productId,
        quantity: 1,
      }
    
     }
    return from(updateDoc(ref, updateObj));
  }


  updateCart(cartItemId:string, productId:string ): Observable<any> {
    const ref = doc(this.firestore, 'carts', cartItemId);
    const updateObj= { 
      
      products: arrayUnion( { productId: productId, quantity: 1 })
    
     }
    return from(updateDoc(ref, updateObj));
  }

  deleteCartItem(cartItemId:string, productId:string): Observable<any> {
    const ref = doc(this.firestore, 'carts', cartItemId);
    const updateObj= { 
      
      products: arrayRemove( { productId: productId, quantity: 1 })
    
     }
    return from(updateDoc(ref, updateObj));
  }

  updateCartQuantity(cartItemId:string, quantity:number): Observable<any> {
    const ref = doc(this.firestore, 'carts', cartItemId);
    const updateObj= { 
      
      products: arrayUnion( {  quantity: quantity})
    
     }
    return from(updateDoc(ref, updateObj));
  }




  updateCart123(cartItemId: string, productId: string): Observable<any> {
  const ref = doc(this.firestore, 'carts', cartItemId);
  

  return from(getDoc(ref)).pipe(
    switchMap((docSnapshot) => {
      // Check if the cart item exists
     // console.log("hi ");
      if (docSnapshot.exists()) {
        const currentProducts = docSnapshot.data()['products'] || [];

        // Append the new product to the products array
      //  console.log("curr products: ", currentProducts);
        const newProduct = {
          productId: productId,
          quantity: 1,
        };
        currentProducts.push(newProduct);

        // Update the cart with the updated products array
        const updateObj = {
          products: currentProducts,
        };

        return from(updateDoc(ref, updateObj));
      } else {
        // Handle the case where the cart item does not exist
        return throwError('Cart item not found');
      }
    })
  );
}



  // updateCart(cartItemId: string, productId: string): Observable<any> {
  //   const ref = doc(this.firestore, 'carts', cartItemId);
  //   console.log("ref: ", ref);
  //   return from(getDoc(ref)).pipe(
  //     map((doc) => {
  //       console.log("in map in method: ");
  //       if (doc.exists()) {
  //         console.log("cart data: ");
  //         const cartData = doc.data();
  //         console.log("cart data: ",cartData);
  //        // cartData.cartItems.push({ productId: productId, quantity: 1 }); // push new product data to existing products array
  //         return cartData;
  //       } else {
  //         throw new Error(`Cart with ID ${cartItemId} does not exist`);
  //       }
  //     }),
  //     concatMap((cartData) => {
  //       return from(updateDoc(ref, cartData));
  //     })
  //   );
  // }
  // createCart(userId: string): Observable<any> {
  //   const userCartRef = doc(this.firestore, 'carts', userId);
  //   const userProductsRef = collection(userCartRef, 'products');
  //   const data = {
  //     cartId: userId,
  //   };
  //   return from(setDoc(userCartRef, data)).pipe(
  //    // map((docRef) => docRef.id), // extract document id and return as string
  //     concatMap(() => addDoc(userProductsRef, { productId: 'example' }))
  //   );
  // }
  addToCart3(userId:string, productId:string): Observable<any>{
    const ref = collection(this.firestore, 'carts', userId, 'shoppingCart');
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          productId: productId,
          quantity: 1,
        })
      )
    );
  }
  

  // isExistingItem(activeProductId: string): Observable<string | null>{
  //   return this.myCartProducts$.pipe(
  //     take(1),
  //     map(products => {

  //       for(let i=0; i < products.length; i++){
  //         if(products[i].productId.includes(activeProductId)){
  //           return products[i].id;
  //         }
  //       }
        
  //       return null;
  //     })
  //   )
  // }
  // getMyCartProductsTest$(userId:string, productId:string): Observable<CartItem[]>{
  //   const ref = collection(this.firestore, 'cart',userId,"shoppingCart")
  //   return this.usersService.currentUserProfile$.pipe(
  //     concatMap((user)=> {
  //       const myQuery = query(ref, where('productId', 'array-contains', productId))
  //       return collectionData(myQuery, {idField: 'id'}).pipe(
  //         map(chats =>  chats as CartItem[])
  //       ) as Observable<CartItem[]>
  //     })
  //   )
  // }
  get MyCartProductsTesty$(): Observable<any[]>{
    return this.usersService.currentUserProfile$.pipe(
      concatMap((user) => {
        const ref = collection(this.firestore, 'cart', user!.uid, 'shoppingCart');
        return collectionData(ref).pipe(
          map(shoppingCartItems => shoppingCartItems as any)
        ) as Observable<any>
      })
    );
  }
  get MyCartProductsTest1$(): Observable<any[]>{
    
        const ref = collection(this.firestore, 'shoppingCart', 'he3p06lqka5ymBPKHIS8');
        return collectionData(ref).pipe(
          map(shoppingCartItems => shoppingCartItems as any)
        ) as Observable<any>
      
    
  }
  ngOnInit() {
    // this.getMyCart$.pipe(untilDestroyed(this)).subscribe(
    //   userCarts => {
    //     userCarts.forEach((userCart) => {
    //       userCart.products?.forEach((product) => {
    //         const isProductExists = this.userCartNew.some(item => item.productId === product.productId);
    //         if (!isProductExists) {
    //           this.userCartNew.push(product);
    //         }
    //       });
    //     });
    //     console.log(this.userCartNew.length," length")
    
    //     // Remove items from userCart that are not in getMyCart
    //     this.userCartNew = this.userCartNew.filter(item =>
    //       userCarts.some(userCart => userCart.products?.some(product => product.productId === item.productId))
    //     );
    
    //     console.log("userCart", this.userCartNew);
    //   },
    //   error => console.log('Error fetching products', error)
    // );
  }
  // updateProductsArray(){
  //   const collectionRef = firestore.collection('yourCollection');
  //   const documentRef = collectionRef.doc('yourDocument');
    
  //   documentRef.update({
  //     yourArrayField: firebase.firestore.FieldValue.arrayUnion('newElement')
  //   })
  // }

  // getMyCartProducts$(userId:string, productId:string): Observable<CartItem[]>{
  //   const ref = collection(this.firestore, 'cart',userId,"shoppingCart")
    
  //       const myQuery = query(ref, where('productId', 'array-contains', productId))
  //       return collectionData(myQuery, {idField: 'id'}).pipe(
  //         map(chats =>  chats as CartItem[])
  //       ) as Observable<CartItem[]>
  //     }
    
  }
  // isExistingChat(otherUserId: string): Observable<string | null>{
  //   return this.myChats$.pipe(
  //     take(1),
  //     map(chats => {

  //       for(let i=0; i < chats.length; i++){
  //         if(chats[i].userIds.includes(otherUserId)){
  //           return chats[i].id;
  //         }
  //       }
        
  //       return null;
  //     })
  //   )
  // }
  // addChatMessage(chatId: string, message: string): Observable<any> {
  //   const ref = collection(this.firestore, 'chats', chatId, 'messages');
  //   const chatRef = doc(this.firestore, 'chats', chatId);
  //   const today = Timestamp.fromDate(new Date());
  //   return this.usersService.currentUserProfile$.pipe(
  //     take(1),
  //     concatMap((user) =>
  //       addDoc(ref, {
  //         text: message,
  //         senderId: user?.uid,
  //         sentDate: today,
  //       })
  //     ),
  //     concatMap(() =>
  //       updateDoc(chatRef, { lastMessage: message, lastMessageDate: today })
  //     )
  //   );
  // }
  // createCartt(userId: string): Observable<string> {
  //   const ref = doc(this.firestore, 'carts', userId);
  //   const data = {
  //     cartItemId: userId,
  //     products: [],
      
  //   };
  //   return from(addDoc(ref, data)).pipe(map(() => userId));
  // }

// createProduct(product: Product): Observable<string> {
//     const ref = collection(this.firestore, 'products');
//     return this.usersService.currentUserProfile$.pipe(
//       take(1),
//       concatMap(user => {
//         const productData = {
//           userIds: [user?.uid],
//           photoURL: product?.photoURL ?? '',
//           productName: product?.productName ?? '',
//           price: product?.price ?? '',
//           condition: product?.condition ?? '',
//           productId: '' // add an empty string for now
//         };
//         return from(addDoc(ref, productData)).pipe(
//           map(docRef => {
//             const productId = docRef.id;
//             // Update the productData object with the new ID
//             productData.productId = productId;
//             // Update the document with the new ID
//            // this.updateProductId(productId);
//             // Return the ID for use in the app
//             return productId;
//           })
//         );
//       })
//     );
//   }
  // createProduct(product: Product): Observable<string> {
  //   const ref = collection(this.firestore, 'products');
  //   return this.usersService.currentUserProfile$.pipe(
  //     take(1),
  //     concatMap(user => {
  //       const productData = {
  //         userIds: [user?.uid],
  //         photoURL: product?.photoURL ?? '',
  //         productName: product?.productName ?? '',
  //         price: product?.price ?? '',
  //         condition: product?.condition ?? '',
  //         productId: '' // add an empty string for now
  //       };
  //       return from(addDoc(ref, productData)).pipe(
  //         map(docRef => {
  //           const productId = docRef.id;
  //           // Update the productData object with the new ID
  //           productData.productId = productId;
  //           // Update the document with the new ID
  //           this.updateCartItemId(CartItemId);
  //           // Return the ID for use in the app
  //           return productId;
  //         })
  //       );
  //     })
  //   );
  // }
