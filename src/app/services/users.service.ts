import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

    get currentUserProfile$(): Observable<ProfileUser | null> {
        return this.authService.currentUser$.pipe(
          
            switchMap((user) => {
                if (!user?.uid){
                    console.log("no user")
                    return of(null);
                }
                const ref = doc(this.firestore, 'users', user?.uid)
               // console.log(user?.uid)
                return docData(ref) as Observable<ProfileUser>;
            })
        )
    }
    get allUsers$(): Observable<ProfileUser[]>{
      const ref = collection(this.firestore, 'users');
      const queryAll = query(ref);
      return collectionData(queryAll) as Observable<ProfileUser[]>;
    }
    get specificUser$(): Observable<ProfileUser[]>{
      const ref = collection(this.firestore, 'users');
      const querys = query(ref, where('uid', '==', 'tW0hge0j6XfGQnSQeW2Kz1eKpxB3') );
    
      return collectionData(querys, { idField: 'id' }).pipe(
        map(users =>  users as ProfileUser[])
      ) as Observable<ProfileUser[]> 
    }
    getSpecificUser$(uid: string | undefined): Observable<ProfileUser[]> {
      const ref = collection(this.firestore, 'users');
      const querys = query(ref, where('uid', '==', uid));
    
      return collectionData(querys, { idField: 'id' }).pipe(
        map(users =>  users as ProfileUser[])
      ) as Observable<ProfileUser[]>
    }
    get specificProducts$(): Observable<Product[]>{
      const ref = collection(this.firestore, 'products');
      const querys = query(ref, where('userIds', 'array-contains', 'tW0hge0j6XfGQnSQeW2Kz1eKpxB3'));
    
      return collectionData(querys, { idField: 'id' }).pipe(
        map(products =>  products as Product[])
      ) as Observable<Product[]> 
    }
    testAllUsers$(): Observable<ProfileUser[]>{
      const ref = collection(this.firestore, 'users');
      const queryAll = query(ref);
      return collectionData(queryAll) as Observable<ProfileUser[]>;
    }
    // get specificProducts$(): Observable<Product[]>{
    //   const ref = collection(this.firestore, 'products');
    //   const querys = query(ref, where('userIds', 'array-contains', 'tW0hge0j6XfGQnSQeW2Kz1eKpxB3'));
    
    //   return collectionData(querys, { idField: 'id' }).pipe(
    //     map(products =>  products as Product[])
    //   ) as Observable<Product[]> 
    // }
  constructor(private firestore: Firestore,  private authService: AuthenticationService,) {}

 
  addUser(user: ProfileUser) : Observable<any> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser) : Observable<any> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc( ref, { ...user }));
  }
  
}