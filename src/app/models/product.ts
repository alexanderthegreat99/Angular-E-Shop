// export interface Product {
//     photoURL: string;
//     productName: string;
//     price: string;
//     condition: string;
//   }
export interface Product {
  id?: string;
  photoURL: string;
  productName: string;
  price: string;
  condition: string;
  userIds?: string;
}