import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  showAdmin = false;
  showManager = false;
  showStaff = false;
  username: string;

  title = 'waveCarsten';

  navigation = [
    { link: 'users-list', label: 'Users List', icon: 'schedule', loggedIn: ''},
    { link: 'user-view', label: 'User View',icon: 'chat'},
    { link: 'create-user', label: 'Create User', icon: 'assignment_ind'},

  ];

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {

 

    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
