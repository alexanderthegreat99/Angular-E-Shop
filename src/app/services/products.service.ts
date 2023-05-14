import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  where,
  query,
  doc,
  updateDoc,
  deleteDoc

  
} from '@angular/fire/firestore';

import { UsersService } from './users.service';
import { concatMap, map, Observable, take, from, switchMap, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private p = new BehaviorSubject<number>(1);
  constructor(private firestore: Firestore, private usersService: UsersService) { }
  // createProduct(product: Product): Observable<string>{
  //   const ref = collection(this.firestore, 'products');
  //   return this.usersService.currentUserProfile$.pipe(
  //     take(1),
  //     concatMap(user => addDoc(ref, {
  //       userIds: [user?.uid],
  //       product: [
  //         { //photoURL: product?.photoURL ?? '',
  //           product: product?.productName ?? '',
  //           price: product?.price ?? '',
  //           condition: product?.condition ?? '',
  //         },
          
  //       ]
  //     })),
  //     map(ref=> ref.id)
  //   )

  // }
//   get allProducts$(): Observable<Product[]>{
//     const ref = collection(this.firestore, 'products')
  
//     return collectionData(ref, {idField: 'id'}) as Observable<Product[]>
    

// }
get allProducts$(): Observable<Product[]>{
  const ref = collection(this.firestore, 'products')

  return collectionData(ref, {idField: 'id'}).pipe(
    map(products =>  products as Product[])
  ) as Observable<Product[]> 

}
get specificProducts$(): Observable<Product[]>{
  const ref = collection(this.firestore, 'products');
  const querys = query(ref, where(ref.id, '==', 'tW0hge0j6XfGQnSQeW2Kz1eKpxB3'));

  return collectionData(querys, { idField: 'id' }).pipe(
    map(products =>  products as Product[])
  ) as Observable<Product[]> 
}
getSpecificProduct$(id: string): Observable<Product[]> {
  console.log("id in method69 : ", id)
  const ref = collection(this.firestore, 'products');
  const docRef = doc(ref, id);

  const querys = query(ref, where('productId', '==', id));
//console.log("ref id: ", docRef)
console.log("refs comparison: docRef.id : ", docRef.id, " and stringID: ", id )
  return collectionData(querys, { idField: 'id' }).pipe(
    map(product =>  product as Product[])
  ) as Observable<Product[]>
}
// getSpecificProduct$(id: string ): Observable<Product[]> {
//   console.log("id in method69 : ", id)
//   const ref = collection(this.firestore, 'products',id);
//   return collectionData(ref).pipe(
//     map(product =>  product as Product[])
//   ) as Observable<Product[]>
// }
// allProducts$: Observable<Product[]> = this.auth.user.pipe(
//   switchMap(user => {
//     const productsRef = collection(this.firestore, 'products');
//     const products$ = collectionData<Product>(productsRef, { idField: 'id' });

//     console.log('products', products$); // Log the fetched products to the console

//     return products$;
//   })
// );
  // createProduct(product: Product): Observable<string> {
  //   const ref = collection(this.firestore, 'products');
  //   return this.usersService.currentUserProfile$.pipe(
  //     take(1),
  //     concatMap(user => {
  //       const productData = {
  //         userIds: [user?.uid],
  //         product: [
  //           {
  //             photoURL: product?.photoURL ?? '',
  //             productName: product?.productName ?? '',
  //             price: product?.price ?? '',
  //             condition: product?.condition ?? '',
  //           },
  //         ]
  //       };
  //       return from(addDoc(ref, productData));
  //     }),
  //     map(ref => ref.id)
  //   );
  // }
  // createProduct(product: Product): Observable<string> {
  //   const ref = collection(this.firestore, 'products');
  //   return this.usersService.currentUserProfile$.pipe(
  //     take(1),
  //     concatMap(user => {
  //       const productData = {
  //         userIds: [user?.uid],
          
            
  //             photoURL: product?.photoURL ?? '',
  //             productName: product?.productName ?? '',
  //             price: product?.price ?? '',
  //             condition: product?.condition ?? '',
            
          
  //       };
  //       return from(addDoc(ref, productData));
  //     }),
  //     map(ref => ref.id)
  //   );
  // }
  updateP(newValue: number) {
    this.p.next(newValue);
  }

  createProduct(product: Product): Observable<string> {
    const ref = collection(this.firestore, 'products');
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap(user => {
        const productData = {
          userIds: [user?.uid],
          photoURL: product?.photoURL ?? '',
          productName: product?.productName ?? '',
          price: product?.price ?? '',
          condition: product?.condition ?? '',
          productId: '' // add an empty string for now
        };
        return from(addDoc(ref, productData)).pipe(
          map(docRef => {
            const productId = docRef.id;
            // Update the productData object with the new ID
            productData.productId = productId;
            // Update the document with the new ID
            this.updateProductId(productId);
            // Return the ID for use in the app
            return productId;
          })
        );
      })
    );
  }
  // updateProduct(product: Product) : Observable<any> {
  //   const ref = doc(this.firestore, 'users', product.);
  //   return from(updateDoc( ref, { ...product }));
  // }
  
  updateProductId(productId: string): Observable<void> {
    const ref = doc(this.firestore, 'products', productId );
    return from(updateDoc(ref, { productId: productId }));
  }
  
  updateProductTest(product: Product): Observable<any> {
    const ref = doc(this.firestore, 'products', product.productId );
    return from(updateDoc(ref, { productId: product }));
  }
  updateProduct(product: Product): Observable<any> {
    const ref = doc(this.firestore, 'products', product.productId );
    return from(updateDoc(ref, {...product }));
  }
  updateProductPartial(productId: string, updateObj: Partial<Product>): Observable<any> {
    const ref = doc(this.firestore, 'products', productId);
    return from(updateDoc(ref, updateObj));
  }
  deleteProduct(productId: string) {
    const ref = doc(this.firestore, 'products', productId);
    return deleteDoc(ref);
  }
  
  // updateUser(user: ProfileUser) : Observable<any> {
  //   const ref = doc(this.firestore, 'users', user.uid);
  //   return from(updateDoc( ref, { ...user }));
  // }
  
  
}
