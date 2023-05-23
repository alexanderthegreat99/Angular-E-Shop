import { Component } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { UsersService } from 'src/app/services/users.service';
import { ProductsService } from 'src/app/services/products.service';
import {
  Observable,
  combineLatest,
  map,
  of,
  tap
} from 'rxjs';
import { Product } from 'src/app/models/product';
import { CartItem, myCart, newCartItem, myCartNew} from 'src/app/models/cart-item';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  user$ = this.usersService.currentUserProfile$;
  allProducts$ = this.productsService.allProducts$;
  getMyCart$ = this.shoppingCartService.getMyCart$;
  combinedStreamNew$ = this.shoppingCartService.combinedStreamNew$;
  userCartNew: myCartNew[] = [];
  productsArray: any[] = [];
  productWithDetailsLength: number = 0;
  userCartId:string = "";
  TotalCost: any;
  
  //getMyCart1$ = this.shoppingCartService.getMyCart$.products;
  myCompleteCartTest$ = combineLatest([this.getMyCart$,this.allProducts$]).pipe(
    map(([cartItem,products ]: any[]) =>{
      const product = products.find((p: Product) => p.productId === cartItem.id);
      return { ...cartItem, product};
    })
  );
  // myCompleteCartTest5$ = combineLatest([this.getMyCart$, this.user$,  this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
  //   map(([users, user, searchString]) => { return users.filter((u) =>  u.displayName?.toLowerCase().includes(searchString!.toLowerCase()) && u.uid !== user?.uid);
  //  })
  // );
  // users$ = combineLatest([this.usersService.allUsers$, this.user$,  this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
  //   map(([users, user, searchString]) => { return users.filter((u) =>  u.displayName?.toLowerCase().includes(searchString!.toLowerCase()) && u.uid !== user?.uid);
  //  })
  // );
  // myCompleteCart1$ = combineLatest([this.getMyCart$, this.allProducts$]).pipe(
  //   map(([cartItems, products]) => {
  //     return cartItems.map((cartItem) => {
  //       const product = products.find((p) => p.productId === cartItem.products?.productId);
  //       return { ...cartItem, product };
  //     });
  //   })
  // );
  // myCompleteCart2$ = combineLatest([this.getMyCart$, this.allProducts$]).pipe(
  //   map(([getMyCart, products]) => {
  //     return getMyCart.map((getMyCart:myCart) => {
  //      // const cartItem of getMyCart;
  //       const product = products.find((p) => p.productId === cartItem?.productId);
  //       return { ...getMyCart, product };
  //     });
  //   })
  // );
  myCompleteCart3$ = combineLatest([this.getMyCart$, this.allProducts$]).pipe(
    map(([cartItems, products]) => {
      return cartItems.map((cartItem) => {
        const product = products?.find((p) => p.productId === cartItem.products?.[0].productId);
        return { ...cartItem, product };
      });
    })
  );
  myCompleteCartTest1$ = combineLatest([this.getMyCart$, this.allProducts$]).pipe(
    map(([cartItems, products]) => {
      return cartItems.map((cartItem) => {
        const updatedProducts = cartItem.products?.map((productItem) => {
          const product = products.find((p) => p.productId === productItem.productId);
          return { ...productItem, product };
        });
        return { ...cartItem, products: updatedProducts };
      });
    })
  );
  myCompleteCart$ = combineLatest([this.getMyCart$, this.allProducts$]).pipe(
    map(([cartItems, products]) => {
      return cartItems.map((cartItem) => {
        const updatedProducts = cartItem.products?.map((productItem) => {
          const product = products.find((p) => p.productId === productItem.productId);
          return { ...productItem, product };
        });
        return { ...cartItem, products: updatedProducts || [] }; // Use empty array if no products found
      });
    })
  );
 
  combinedStream$ = combineLatest([
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
         // console.log("products ", product);
         
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
         // console.log("productWithDetail",productWithDetail)
          //this.productsArray.push(productWithDetail);
        }
        });
        });
        
      //  console.log("productsWithDetails: ", productsWithDetails.length);
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
  
  updateQuantity1(productId: string | undefined,event: any){
    if(event){
    console.log("event " , event.srcElement.value, "productid: ", productId );
    }
  }
  updateQuantity(productId: string | undefined, event: any) {
    if (event) {
      console.log("event ", event.srcElement.value, "productid: ", productId);
      const newQuantity = event.srcElement.value;
  
      this.userCartNew = this.userCartNew.map(item => {
        if (item.product.productId === productId) {
          return {
            ...item,
            quantity: newQuantity
          };
        }
        
        return item;
      });
      this.calculateCartTotal(this.userCartNew);
    }
   
  }
  removeItem(productId:string){
    this.shoppingCartService.deleteCartItem(this.userCartId,productId);
  }


  calculateCartTotal(products: myCartNew[]) {
    let totalCost = 0;
  
    for (let i = 0; i < products.length; i++) {
      const product = products[i].product;
      const quantity = products[i].quantity;
      const price = parseFloat(product.price.replace('$', '')); // Remove the '$' sign and parse as float
      console.log(quantity);
      console.log(price);
      totalCost += quantity * price;
      
    }
    this.TotalCost = totalCost;
    console.log("totalcost: ",totalCost);
    console.log("totalcost: ",this.TotalCost);
    return totalCost;
   
  }

  //shoppingCartItem$ = this.shoppingCartService.getMyCartProducts$(this.user$.uid ,"GsOEPg9X8vih1bfU3O0v");
  //shoppingCartItem$ = this.shoppingCartService.MyCartProductsTest1$;
  constructor(
    private shoppingCartService: ShoppingCartService,
    private usersService: UsersService,
    private productsService:ProductsService

  ) {}
    
  ngOnInit() {
    //console.log("products array ",this.productsArray)
    //console.log(this.combinedStream$.forEach(products=> products.forEach(product=>product.length))));
    // this.shoppingCartItem$.subscribe(shoppingCartItems => {
    //   console.log(shoppingCartItems);
    // });
    
      // this.getMyCart$.subscribe((cartData:any) => {
      //   this.productsArray = cartData[0]
      //   console.log("cart data:" ,cartData)
      //   console.log("cart data[0]:" ,cartData[0]?.products);
      // });
     // this.userCartNew = this.shoppingCartService.userCartNew;
    this.combinedStream$.pipe(untilDestroyed(this)).subscribe(
      userCartArray=>{
        userCartArray.forEach((userCart)=>{
        userCart.products?.forEach((cartItem)=>{
         // console.log(cartItem.product);
          const isProductExists = this.userCartNew.some(item => item.product.productId === cartItem.product?.productId);
          //console.log("quantity: ",cartItem.quantity)
          if (!isProductExists) {
            const productWithQuantity = {
              product: cartItem.product!,
              quantity: cartItem.quantity
            };
          this.userCartNew.push(productWithQuantity);
          console.log(this.userCartNew);
          }
        })

        });

      }
    );
     this.getMyCart$.pipe(untilDestroyed(this)).subscribe(
      userCarts => {
        // userCarts.forEach((userCart) => {
        //   userCart.products?.forEach((product) => {
        //     console.log(product);
        //     const isProductExists = this.userCartNew.some(item => item.productId === product.productId);
        //    if (!isProductExists) {
        //      this.userCartNew.push(product);
        //    }
        // //   });
        // });
      //  console.log(this.userCartNew.length," length")
    
        // Remove items from userCart that are not in getMyCart
        this.userCartNew = this.userCartNew.filter(item =>
          userCarts.some(userCart => userCart.products?.some(product => product.productId === item.product.productId))
        );
        this.calculateCartTotal(this.userCartNew);
       console.log("userCart", this.userCartNew);
       
      },
      error => console.log('Error fetching products', error)
    );
      console.log("userCartNew: ",this.userCartNew)
    //  const totalCost=  this.calculateCartTotal(this.userCartNew);
     
    //  console.log("Total cost: ", totalCost);
     // console.log("userCartNew: ",this.shoppingCartService.userCartNew)
      this.combinedStreamNew$.subscribe(updatedCart => {
        //console.log("updatedcart id: ",updatedCart[0].id);
        this.userCartId = updatedCart[0].id;

        //console.log("updated Cart: ",updatedCart);
      });

     //////////////////////////////////////////////////////
    //  this.getMyCart$.pipe(untilDestroyed(this)).subscribe(
    //   userCarts => {
    //     userCarts.forEach((userCart) => {
    //       userCart.products?.forEach((product) => {
    //        // console.log(product);
    //         const isProductExists = this.userCartNew.some(item => item.productId === product.productId);
    //         if (!isProductExists) {
    //           this.userCartNew.push(product);
    //         }
    //       });
    //     });
    //   //  console.log(this.userCartNew.length," length")
    
    //     // Remove items from userCart that are not in getMyCart
    //     this.userCartNew = this.userCartNew.filter(item =>
    //       userCarts.some(userCart => userCart.products?.some(product => product.productId === item.productId))
    //     );
    
    //   //  console.log("userCart", this.userCartNew);
    //   },
    //   error => console.log('Error fetching products', error)
    // );
    //  // console.log("userCartNew: ",this.userCartNew)
    //  // console.log("userCartNew: ",this.shoppingCartService.userCartNew)
    //   this.combinedStreamNew$.subscribe(updatedCart => {
    //     //console.log("updatedcart id: ",updatedCart[0].id);
    //     this.userCartId = updatedCart[0].id;

    //     //console.log("updated Cart: ",updatedCart);
    //   });
    
      }
    }
  

