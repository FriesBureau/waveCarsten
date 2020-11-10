import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoleGuardService } from './services/role-guard.service';

const routes: Routes = [
  {
    path: 'users-list',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./components/users-list/users-list.module').then(m => m.UsersListModule)
  },
  { path: 'authentication', component: AuthenticationComponent, },
  { path: 'create-user', component: CreateUserComponent, data: {role: '1'}, canActivate: [RoleGuardService] },
  { path: 'user-view', component: UserViewComponent, canActivate: [RoleGuardService] },
  { path: 'user-view/:id', component: UserViewComponent, canActivate: [RoleGuardService]  },
  { path: '', redirectTo: 'users-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
