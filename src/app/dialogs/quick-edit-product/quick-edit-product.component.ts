import { Component, Inject } from '@angular/core';
import { FormControl,  FormGroup, NonNullableFormBuilder  } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileUser } from 'src/app/models/user';
import { Observable, tap, Subscription, switchMap, of } from 'rxjs';
import { Firestore, collection, collectionData, where, query, } from '@angular/fire/firestore';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { HomeComponent } from 'src/app/components/home/home.component';
import { Product } from 'src/app/models/product';
import { NgToastService } from 'ng-angular-popup';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { MatDialogRef } from '@angular/material/dialog';
@UntilDestroy()
@Component({
  selector: 'app-quick-edit-product',
  templateUrl: './quick-edit-product.component.html',
  styleUrls: ['./quick-edit-product.component.css']
})
export class QuickEditProductComponent {
  myProduct: Product | undefined;
  productId: string | undefined;
  product$!: Observable<Product[]>;
  user$ = this.usersService.currentUserProfile$;

  profileForm = this.fb.group({
    productName: [''],
    price: [''],
    condition: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { myProduct: Product | undefined }, private firestore: Firestore, private productsService: ProductsService, private usersService: UsersService, private chatsService: ChatsService,  private fb: NonNullableFormBuilder, private imageUploadService: ImageUploadService, private toast: NgToastService, private dialogRef: MatDialogRef<QuickEditProductComponent>) {
    
  }
  ngOnInit() {
   
    this.myProduct = this.data.myProduct;
    
    this.productId = this.myProduct?.productId
    
    this.product$ = this.productsService.getSpecificProduct$(this.productId!).pipe(untilDestroyed(this));
  
    this.productsService.getSpecificProduct$(this.productId!).pipe(untilDestroyed(this)).subscribe((product)=>{
      if(product && product.length > 0) {
      console.log("should return product: ",product)
      this.profileForm.patchValue({ 
        productName: product[0].productName,
        price: product[0].price,
        condition: product[0].condition});
      }
     
    }
  
    )
  
   
  }
  ngAfterViewInit(){
    // this.product$.pipe(untilDestroyed(this)).subscribe((result)=>{
    //   console.log("should return product: ", result);
    // });
  }
  uploadImage(event: any, { uid }: ProfileUser,  { productId }: Product){
 
    if(!event.target.files[0]){
      return;
    }
    const timestamp = new Date().getTime();
    const fileName = `images/products/${uid}/${timestamp}_${event.target.files[0].name}`;
    
    this.imageUploadService.uploadImage(event.target.files[0],fileName).pipe(
     // concatMap((photoURL) => this.usersService.updateUser({ uid: user.uid, photoURL}))
     
    //  switchMap((photoURL) =>
    //         this.usersService.updateUser({
    //           uid,
    //           photoURL,
    //         })
    //       )
    switchMap((photoURL) =>
    this.productsService.updateProductPartial(productId, { photoURL })
  )

  
    ).pipe(untilDestroyed(this)).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Uploaded the Image!', duration: 5000});
    
      
    }, err=>{
      this.toast.error({detail:"ERROR",summary:'Image Upload failed!', duration: 5000})
    });
   }
   saveProduct() {
    const { productName, price, condition} = this.profileForm.value;
  
    if (!this.productId) {
      return;
    }
    this.productsService.updateProductPartial(this.productId,{ productName, price, condition}).pipe(untilDestroyed(this)).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Updated Product Info!', duration: 5000});
    
      
    }, err=>{
      this.toast.error({detail:"ERROR",summary:'Product Info Update Failed!', duration: 5000})
    });
    
      
  }
  confirmDelete(){
    if (confirm("Are you sure you want to delete this product?")) {
     console.log("confirmed delete")
    this.deleteProduct();
    // this.dialogRef.close()
    }
  }
  deleteProduct(){
    this.productsService.deleteProduct(this.productId!)
      .then(() =>  this.dialogRef.close())
      .catch(error => console.log("Error deleting product", error));
  }
}
