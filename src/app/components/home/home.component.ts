import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
//import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { ChatsService } from 'src/app/services/chats.service';
import {
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  @ViewChild('endOfChat') endOfChat!: ElementRef;
//user$ = this.authService.currentUser$;
  user$ = this.usersService.currentUserProfile$;
  searchControl = new FormControl('');
  chatListControl = new FormControl();
  messageControl = new FormControl('');
  //users$ = this.usersService.allUsers$;
   users$ = combineLatest([this.usersService.allUsers$, this.user$,  this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
     map(([users, user, searchString]) => { return users.filter((u) =>  u.displayName?.toLowerCase().includes(searchString!.toLowerCase()) && u.uid !== user?.uid);
    })
   );
  
    myChats$ = this.chatsService.myChats$;
    
    // selectedChat$ = combineLatest([
    //   this.chatListControl.valueChanges,
    //   this.myChats$,
    // ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value[0])));
  
 
    selectedChat$ = combineLatest([
      this.chatListControl.valueChanges,
      this.myChats$,
    ]).pipe(
      tap(([value]) => console.log('Selected chat:', value)),
      map(([value, chats]) => chats.find((c) => c.id === value[0]))
    );

    messages$ = this.chatListControl.valueChanges.pipe(
      map(value => value[0]),
      switchMap(chatId => this.chatsService.getChatMessages$(chatId)),
      tap(()=>{
        this.scrollToBottom();
      })
    )

  constructor(
    private usersService: UsersService,
    private chatsService: ChatsService,

  ) {}
  // createChat(otherUser:ProfileUser){
  //   this.chatsService.createChat(otherUser).subscribe();
  // }
  ngOnInit(){
    this.chatsService.myChats$.subscribe(chats => console.log("chats: ", JSON.stringify(chats)));
  }
  createChat(otherUser:ProfileUser){
       this.chatsService.isExistingChat(otherUser.uid).pipe(
        switchMap(chatId => {
          if (chatId){
            return of(chatId);
          }else {
            return this.chatsService.createChat(otherUser);
          }
        })
       ).subscribe(chatId => {
        this.chatListControl.setValue([chatId]);
       })
    }
  sendMessage(){
    const message = this.messageControl.value;
    const selectedChatId =this.chatListControl.value[0];
    
    if (message && selectedChatId){
      this.chatsService.addChatMessage(selectedChatId, message).subscribe(
        () => {
          this.scrollToBottom();
        }
      );
      this.messageControl.setValue('');
    }
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}