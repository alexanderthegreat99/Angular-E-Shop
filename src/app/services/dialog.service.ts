import { Injectable, Inject} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, BehaviorSubject } from 'rxjs';
import { QuickMessageComponent } from '../dialogs/quick-message/quick-message.component';
import { QuickEditProductComponent } from '../dialogs/quick-edit-product/quick-edit-product.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../models/product';
//import { ConfirmDialogData } from '../models/confirm-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  

  constructor(private dialog: MatDialog) { }
  quickMessageDialog(userIds: string | undefined){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { userIds: userIds };
    this.dialog.open(QuickMessageComponent, dialogConfig);

  }
  quickEditProduct(myProduct: Product | undefined){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { myProduct: myProduct};
    this.dialog.open(QuickEditProductComponent, dialogConfig);

  }

}
