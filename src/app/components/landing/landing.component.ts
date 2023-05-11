import { Component, ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { delay } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
@UntilDestroy()
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  users: ProfileUser[] | undefined;
  constructor( private usersService: UsersService, private cdr: ChangeDetectorRef) {
    console.log('constructor called');
  
    this.usersService.currentUserProfile$.subscribe((user) => {
      console.log('Current user:', user);
    });
  }
  ngOnInit() {
    this.usersService.allUsers$.pipe(untilDestroyed(this)).subscribe(
      users => {
        this.users = users;

        console.log('all user query 2 in send method: ', users); // Log the fetched products to the console
      },
      error => console.log('error fetching users', error)
    );
  }

  sendMessage(){
    
    this.usersService.allUsers$.pipe(untilDestroyed(this)).subscribe(
      users => {
        this.users = users;

        console.log('all user query 2 in send method: ', users); // Log the fetched products to the console
      },
      error => console.log('error fetching users', error)
    );
  }
  // ngOnInit() {
  //   this.usersService.allUsers$.pipe(untilDestroyed(this)).subscribe(
  //     users => {
        
  //       console.log('all user query, in quick message component  ngoninit ', users); // Log the fetched products to the console
  //     },
  //     error => console.log('error fetching users', error)
  //   );
  // //   this.cdr.detectChanges();
  // //   this.sendMessage();
  //  }
  // ngOnInit() {
  //   setTimeout(() => {
  //     this.usersService.allUsers$.subscribe((users) => {
  //       console.log('All users:', users);
  //     });
  //   }, 4000);
  // }

  // ngOnInit() {
  //   console.log('ngOnInit called');
  
  //   this.usersService.currentUserProfile$.subscribe((user) => {
  //     console.log('Current user:', user);
  //   });
  
  //   setTimeout(() => {
  //     console.log('Timeout executed');
  //     this.usersService.allUsers$.subscribe((users) => {
  //       console.log('All users:', users);
  //     });
  //   }, 4000);
  // }
  test() {
    // Manually trigger change detection
   // this.cdr.detectChanges();
  }
}