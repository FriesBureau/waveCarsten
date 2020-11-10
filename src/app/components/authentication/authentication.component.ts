import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../model/user.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  public authenticationUserForm: FormGroup;
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
      this.authenticationUserForm = this.fb.group({
        email : new FormControl('', [Validators.required, Validators.email]),
        password : new FormControl('', [Validators.required,Validators.minLength(4)]),
      });
     }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/users-list']);
    }
  }

  onSubmit(logindata: User) {
    this.authService.login(logindata).subscribe(
      data => {
        this.tokenStorageService.saveToken(data.access_token);
        this.tokenStorageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.reloadPage();
       },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
   
  }

}
