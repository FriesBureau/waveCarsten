import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ActivatedRoute } from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../model/user.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  selected = [];
  public updateUserForm: FormGroup;
  images: any[] = [];
  @Input() file: File;
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  currentUser: any;
  content: any;
  userId: any;
  isLoggedIn = false;
  alertvisible = false;
  checkForRole = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router

    ) {
      this.updateUserForm = this.fb.group({
        firstName:  new FormControl('', [Validators.required,Validators.minLength(2)]),
        lastName:  new FormControl('', [Validators.required,Validators.minLength(2)]),
        email : new FormControl('', [Validators.required, Validators.email]),
        phone : new FormControl('', [Validators.required,Validators.minLength(8)]),
        role : new FormControl({value: '', disabled: false}),
        photos : this.fb.array([
        ])
      });
     }

     ngOnInit(): void {
      console.log('Tjek Token',this.tokenStorageService.getToken());
      this.authService.getUserInfo().toPromise().then(data => {
          this.currentUser = data;
           this.getFormData();
        },
      )
     .catch((error) => { 
      console.log(error);
      if (error.status === 401) {
        setTimeout(() => this.router.navigate(['/authentication']));
        return error.status;
      }
     });
       this.userId = this.route.snapshot.paramMap.get('id');
    }

    getFormData(){
      if (this.userId === null) {
        this.userService.getUserById(this.currentUser.id).subscribe(
          data => {
            this.content = data;  
            this.updateUserForm.patchValue(data);
    
          },
          err => {
            this.content = JSON.parse(err.error).message;
          }
        );
      }
      else {
       this.userService.getUserById(this.userId).subscribe(
        data => {
          this.content = data;
          this.updateUserForm.patchValue(data);
          if (this.currentUser.role != 1) this.checkForRole = true;
       
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }
    }
     
   createItem(data): FormGroup {
    return this.fb.group(data);
}

get photos(): FormArray {
   return this.updateUserForm.get('photos') as FormArray;
};

detectFiles(event) {
  let files = event.target.files;
  if (files) {
    for (let file of files) {
      file.progress = 0;
      let reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.photos.length <= 2)  {
        this.photos.push(this.createItem({
          file,
          url: e.target.result  //Base64 string for preview image
      }));
      console.log('this.photos',this.photos);
      

     } else {
       this.alertvisible = true;
        }
      }
      reader.readAsDataURL(file);
    }
  }
}

removePhoto(i){
  this.photos.removeAt(i);
  this.alertvisible = false;
}

  onSubmit(userdata: User) {
    console.log('tjek af updateform',userdata,this.userId);
    this.userService.updateUserById(this.userId,userdata).subscribe(
      data => {
        console.log('Create User',data);
        alert('User has been updated');
        setTimeout(() => 
        this.router.navigate(['/user-view/' + data.id]), 2000);
      },
      err => {
       console.log(err.error.message);
      }
    );   
  }
 
 
  deleteUser() {
    this.userService.deleteUserById(this.userId).subscribe(
      response => {
        alert('User has been deleted');
      },
      err => {
        console.log(err.error.message);
       }
       );  
  }
 
  onFileDropped($event) {
this.detectFiles($event);
  }

}
