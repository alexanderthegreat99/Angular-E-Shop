import { Product, ProductQ } from './product';
export interface CartItemTest {
    cartItemId: string;
    products: ProductQ [];
    userId: string;
  }
  export interface CartItem {
    productId?: any;
    quantity: number;
  }
  export interface newCartItem {
    product?: Product;
    quantity: number;
  }
  
  export interface myCart {
   // products?: CartItem[];
    products?: { productId: string; quantity: number; }[];
    userId: string;
    id: string;
  }
  export interface myCart1 {
    // products?: CartItem[];
     products: { productId: string; quantity: number; }[];
     userId: string;
     id: string;
   }
export interface myCartNew {
    // products?: CartItem[];
    product: Product; quantity: number; 
}