import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, find, repeatWhen, mapTo, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['fullname', 'email', 'phone', 'photoscount'];
  data: any  = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  element: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private _httpClient: HttpClient,
    private router: Router
    ) { }
 
  ngOnInit(): void {
 
  } 
  ngAfterViewInit() {
 
     
this.getUsersList();
   
  }

  getUsersList(){
    merge(this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        if(this.paginator.pageIndex === 0 || this.paginator.pageIndex === undefined)
        this.paginator.pageIndex = 1;
        return this.userService.getUsers(
          this.paginator.pageIndex, 1);
      }),
      map(data => {   
        this.isLoadingResults = false;
        this.resultsLength = data.total; 
        return data;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

    searchBox(filterValue: string) {

    if( filterValue.length < 4)
    return;


      merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if(this.paginator.pageIndex === 0 || this.paginator.pageIndex === undefined)
          this.paginator.pageIndex = 1;
          return this.userService.searchUsers(
            this.paginator.pageIndex, 1,filterValue);
        }),
        map(data => {   
          this.isLoadingResults = false;
          this.resultsLength = data.total; 
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  cellClicked(email) { 
    const findid = this.data.data.find(id => id.email === email);
    this.router.navigate(['/user-view/' + findid.id]);
   }
 
}
 

 
