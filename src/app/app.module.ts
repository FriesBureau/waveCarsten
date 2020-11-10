import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UserViewComponent } from './components/user-view/user-view.component';

 
import { authInterceptorProviders } from './interceptor/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthGuardService } from './services/auth-guard.service';
import { RoleGuardService } from './services/role-guard.service';
import { ProgressComponent } from './components/create-user/progress/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    CreateUserComponent,
    UserViewComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [authInterceptorProviders, AuthGuardService, RoleGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
