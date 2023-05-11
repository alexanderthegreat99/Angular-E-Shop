import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
//import { AngularFireModule } from '@angular/fire/compat';
//import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
//import { HotToastModule } from '@ngneat/hot-toast';
//import { AuthenticationService } from 'src/app/services/authentication.service';
import { provideAuth, getAuth } from '@angular/fire/auth';
//import { Auth } from '@angular/fire/auth';
//import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {NgToastModule} from 'ng-angular-popup';
import { MatMenuModule } from '@angular/material/menu';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ProfileComponent } from './components/profile/profile.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DateDisplayPipe } from './pipes/date-display.pipe';
import { DatePipe } from '@angular/common';
import { PostProductComponent } from './components/post-product/post-product.component';
import { ProductsComponent } from './components/products/products.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { QuickMessageComponent } from './dialogs/quick-message/quick-message.component';
import { QuickEditProductComponent } from './dialogs/quick-edit-product/quick-edit-product.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    HomeComponent,
    SignUpComponent,
    ProfileComponent,
    DateDisplayPipe,
    PostProductComponent,
    ProductsComponent,
    QuickMessageComponent,
    QuickEditProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    //AngularFireModule.initializeApp(environment.firebase),
    //provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
 //   AngularFireAuthModule,
   //HotToastModule.forRoot(),
    NgToastModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatListModule,
    MatDividerModule,
    NgxPaginationModule,
    MatDialogModule,
   
  ],
  providers: [
   // { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
   DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }