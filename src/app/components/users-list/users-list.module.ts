import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersListRoutingModule } from './users-list-routing.module';


@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    SharedModule,
    UsersListRoutingModule
  ]
})
export class UsersListModule { }
