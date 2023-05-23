// export interface Product {
//     photoURL: string;
//     productName: string;
//     price: string;
//     condition: string;
//   }
export interface Product {
  productId: string;
  photoURL: string;
  productName: string;
  price: string;
  condition: string;
  userIds?: string;
}
export interface ProductQ extends Product {
  quantity: number;
}