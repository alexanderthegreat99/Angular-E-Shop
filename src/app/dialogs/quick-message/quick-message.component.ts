import { Component, Input, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileUser } from 'src/app/models/user';
import { Observable, tap, Subscription, switchMap, of } from 'rxjs';
import { Firestore, collection, collectionData, where, query, } from '@angular/fire/firestore';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { HomeComponent } from 'src/app/components/home/home.component';


@UntilDestroy()
//import { DialogService } from 'src/app/services/dialog.service';
@Component({
  selector: 'app-quick-message',
  templateUrl: './quick-message.component.html',
  styleUrls: ['./quick-message.component.css']
})
export class QuickMessageComponent {

  users: ProfileUser[] | undefined;
  chosenUser: ProfileUser | undefined;
  userId: string | undefined;

  // constructor(private firestore: Firestore, private usersService: UsersService) { }
  messageControl = new FormControl('');
  // private subscription1: Subscription | undefined;
  // private subscription2: Subscription | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userIds: string | undefined }, private firestore: Firestore, private productsService: ProductsService, private usersService: UsersService, private chatsService: ChatsService,) {

  }

  // sendMessage() {
  //   const message = this.messageControl.value;
  //   console.log("message to seller " + message);
  //   console.log("this is quick message and the seller id is before to string: ", this.data.userIds)
  //   // this.getUserById(this.data.userIds).subscribe((result)=>{
  //   //   console.log(result)
  //   // });
  //   if (Array.isArray(this.data.userIds) && this.data.userIds.length === 1 && typeof this.data.userIds[0] === 'string') {
  //     this.data.userIds = this.data.userIds[0];
  //   }

  //   // Convert id to a string
  //   this.userId = this.data.userIds?.toString();
  //   console.log("id to string : " + this.data.userIds)
  //   this.getUserById(this.data.userIds);

  // }
  createChat(){
    if (!this.chosenUser) {
      console.error('chosenUser is undefined');
      return;
    }
    
      this.chatsService.isExistingChat(this.chosenUser.uid).pipe(
       untilDestroyed(this),
       switchMap(chatId => {
         if (chatId){
           return of(chatId);
         }else {
           return this.chatsService.createChat(this.chosenUser!);
         }
       })
      ).subscribe(chatId => {
      console.log("chatId, ", chatId);
      this.sendMessage(chatId);
      })
   
  }
  sendMessage(chatId: string){
    const message = this.messageControl.value;
   // const selectedChatId =this.chatListControl.value[0];
    
    if (message && chatId){
      this.chatsService.addChatMessage(chatId, message).pipe(
        untilDestroyed(this)).subscribe(
        () => {
          console.log("message sent");
        }
      );
      this.messageControl.setValue('');
    }
  }
//   createChat(otherUser:ProfileUser){
//     this.chatsService.isExistingChat(otherUser.uid).pipe(
//      untilDestroyed(this),
//      switchMap(chatId => {
//        if (chatId){
//          return of(chatId);
//        }else {
//          return this.chatsService.createChat(otherUser);
//        }
//      })
//     ).subscribe(chatId => {
//      this.chatListControl.setValue([chatId]);
//     })
//  }
  ngOnInit() {
    if (Array.isArray(this.data.userIds) && this.data.userIds.length === 1 && typeof this.data.userIds[0] === 'string') {
      this.data.userIds = this.data.userIds[0];
    }
    this.userId = this.data.userIds?.toString();
    console.log("userid: ",this.userId);
    // this.usersService.allUsers$.pipe(untilDestroyed(this)).subscribe(
    //    users => {
    //     this.users = users;
    //    console.log('specific user query, in quick message component  ngoninit ', users); // Log the fetched products to the console
    //    },
    //   error => console.log('error fetching users', error)
    // );
    this.usersService.getSpecificUser$(this.userId).pipe(untilDestroyed(this)).subscribe(
      chosenUser => {
        this.chosenUser = chosenUser[0];
      console.log('specific user query, in quick message component  ngoninit ', chosenUser); // Log the fetched products to the console
      },
     error => console.log('error fetching users', error)
   );
  }
  

  getUserById(id: string | undefined) {
    if (!id) {
      console.log("id is undefined");

    } else {
      console.log("id in getUserById : " + id);
    }

    // console.log("we are in method");
    // this.usersService.allUsers$.pipe(untilDestroyed(this)).subscribe(
    //   users => {

    //     console.log('all user query 2 in send method: ', users); // Log the fetched products to the console
    //   },
    //   error => console.log('error fetching users', error)
    // );
    // this.subscription2 = this.usersService.getSpecificUser$(id).subscribe(
    //   users => {

    //     console.log('specific user query 2 ', users); // Log the fetched products to the console
    //   },
    //   error => console.log('error fetching users', error)
    // );
  }
  // ngOnDestroy() {
  //   if (this.subscription1) {
  //     this.subscription1.unsubscribe();
  //   }
  //   if (this.subscription2) {
  //     this.subscription2.unsubscribe();
  //   }
  // }
hi(){
  
}
}
