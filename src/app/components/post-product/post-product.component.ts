import { Component, ViewChild, ElementRef  } from '@angular/core';
import {  OnInit} from '@angular/core';
//import { UsersService } from 'src/app/services/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { NgToastService } from 'ng-angular-popup';
import {
  User, user,
  
} from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users.service';
import { ProductsService } from 'src/app/services/products.service';
import { concatMap, switchMap, of, Observable} from 'rxjs';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators} from '@angular/forms';
import { ProfileUser } from 'src/app/models/user';
import { Product } from 'src/app/models/product';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()


@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent {
  @ViewChild('editButton') editButton!: ElementRef;

  user$ = this.usersService.currentUserProfile$;
 
  productForm = this.fb.group({
    photoURL: [''],
    productName: ['', Validators.required],
    price: ['', Validators.required],
    condition: ['', Validators.required],
  });

  constructor(
    private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private toast: NgToastService,
    private fb: NonNullableFormBuilder,
    private usersService: UsersService,
    private productsService: ProductsService,

 ) {}
  ngOnInit(): void {
    this.usersService.currentUserProfile$
   // .pipe(untilDestroyed(this))
    .pipe(untilDestroyed(this)).subscribe((user) => {
      //this.profileForm.patchValue({ ...user});
    })
  }
  // uploadImage(event: any, { uid }: ProfileUser){
 
  //   if(!event.target.files[0]){
  //     return;
  //   }
    
  //   this.imageUploadService.uploadImage(event.target.files[0],`images/products/${uid}`).pipe(
  //    // concatMap((photoURL) => this.usersService.updateUser({ uid: user.uid, photoURL}))
     
  //    switchMap((photoURL) =>
  //           this.usersService.updateUser({
  //             uid,
  //             photoURL,
  //           })
  //         )
  
  //   ).subscribe(() => {
  //     this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Uploaded the Image!', duration: 5000});
    
      
  //   }, err=>{
  //     this.toast.error({detail:"ERROR",summary:'Image Upload failed!', duration: 5000})
  //   });
  //  }
  createProducts(){
 
    const product = this.productForm.value;
    const { productName, price, condition, photoURL  } = product;

    //const photoURL = this.productForm.get('photoURL')?.value;


    if (!this.productForm.valid || !productName || !price || !condition || !photoURL) {
      return;
    }
    
    this.productsService.createProduct({productId: '', photoURL,productName, price, condition }).pipe(untilDestroyed(this)).subscribe(() => {
      
      this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Added a Product!', duration: 5000});
      console.log(this.productForm.value);
    console.log(this.productForm);
      this.productForm.reset();

    }, err=>{
      this.toast.error({detail:"ERROR",summary:'Product Add Failed! Try Again.', duration: 5000})
      console.log(err);
    });

  }
  // createProducts(){
  //   const product = this.productForm.value;
  //   const { productName, price, condition } = product;
  
  //   if (!this.productForm.valid || !productName || !price || !condition) {
  //     return;
  //   }
    
  //   this.uploadImage(event, { uid: 'your-uid' }).subscribe((photoURL) => {
  //     this.productsService.createProduct({productName, price, condition }, photoURL).subscribe(() => {
  //       this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Added a Product!', duration: 5000});
  //       this.productForm.reset();
  //     }, err => {
  //       this.toast.error({detail:"ERROR",summary:'Product Add Failed! Try Again.', duration: 5000})
  //       console.log(err);
  //     });
  //   });
  // }
  uploadImage(event: any, { uid }: ProfileUser) {
    if(!event.target.files[0]){
      return;
    }
    if(event.target.files[0]){
      console.log("file is here")
    }
    const timestamp = new Date().getTime();
    const fileName = `images/products/${uid}/${timestamp}_${event.target.files[0].name}`;
    
    this.imageUploadService.uploadImage(event.target.files[0], fileName).pipe(untilDestroyed(this))
      .subscribe((photoURL) => {
        console.log(photoURL);
        this.productForm.patchValue({
          photoURL: photoURL,
      
         
         });
         //this.moveIcon(photoURL);
        this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Uploaded the Image!', duration: 5000});
      
        
      }, err=>{
        this.toast.error({detail:"ERROR",summary:'Image Upload failed!', duration: 5000})
      });
  
    
  }
  // moveIcon(photoURL: string){
  //   console.log("hi")
  //   this.editButton.nativeElement.style.right = `50px`;
  // }
  uploadlmage(event: any, { uid }: ProfileUser){
 
    if(!event.target.files[0]){
      return;
    }
    
    this.imageUploadService.uploadImage(event.target.files[0],`images/profile/${uid}`).pipe(
     // concatMap((photoURL) => this.usersService.updateUser({ uid: user.uid, photoURL}))
     (untilDestroyed(this)),
     switchMap((photoURL) =>
            this.usersService.updateUser({
              uid,
              photoURL,
            })
          )
  
    ).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Uploaded the Image!', duration: 5000});
    
      
    }, err=>{
      this.toast.error({detail:"ERROR",summary:'Image Upload failed!', duration: 5000})
    });
   }
  // uploadImage(event: any, { uid }: ProfileUser): void {
 
  //   if(!event.target.files[0]){
  //     return;
  //   }
    
  //   this.imageUploadService.uploadImage(event.target.files[0],`images/products/${uid}`).pipe(
  //    // concatMap((photoURL) => this.usersService.updateUser({ uid: user.uid, photoURL}))
     
  //    switchMap((photoURL) => {
  //    // this.productForm.controls['photoURL'].setValue(photoURL);
  //     return of(photoURL);
  //   })
       
  
  //   ).subscribe(() => {
  //     this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Uploaded the Image!', duration: 5000});
    
      
  //   }, err=>{
  //     this.toast.error({detail:"ERROR",summary:'Image Upload failed!', duration: 5000})
  //   });
  //  }
  saveProfile(){
    console.log("product saved!")
  }
}
