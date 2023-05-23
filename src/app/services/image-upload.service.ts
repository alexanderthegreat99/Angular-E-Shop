import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { finalize, from, map, Observable, switchMap, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: Storage) {}

  uploadImage1(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    
    return uploadTask.pipe(switchMap((result) =>  getDownloadURL(result.ref),));
  }
//   uploadImage(image: File, path: string): Observable<string> {
  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image)).pipe(
      tap((result) => {
        console.log('Upload Task Result:', result);
      })
    );
    
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    );
  }
}