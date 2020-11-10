import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../model/user.model'


 
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})


export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;
//  createUserForm: any = {};
currentUser: any;
  content: any;
  errormessage: any;
  isLoggedIn = false;
  images: any[] = [];
  @Input() file: File;
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  selected : number = 3;
  alertvisible = false;
  errorvisible = false;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private router: Router
    ) { 

      this.createUserForm = this.fb.group({
        firstName:  new FormControl('', [Validators.required,Validators.minLength(2)]),
        lastName:  new FormControl('', [Validators.required,Validators.minLength(2)]),
        email : new FormControl('', [Validators.required, Validators.email]),
        password : new FormControl('', [Validators.required,Validators.minLength(8)]),
        phone : new FormControl('', [Validators.required,Validators.minLength(8)]),
        role : new FormControl(''),
        photos : this.fb.array([
        ])
      });
    }

    ngOnInit(): void {
      console.log('Tjek Token',this.tokenStorageService.getToken());
      this.authService.getUserInfo().subscribe(
        data => {
          this.content = data;
          console.log('getUserInfo',data,data.firstName);
        },
        err => {
          this.errormessage = JSON.parse(err).message;
        }
      );
  
    }

   createItem(data): FormGroup {
    return this.fb.group(data);
}

get photos(): FormArray {
   return this.createUserForm.get('photos') as FormArray;
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

  onSubmit(user: User) {
    console.log('tjek af form',user);
 
    this.userService.createUser(user).subscribe(
      userdata => {
        console.log('Create User',userdata);
         if(this.photos.length >0) {
          this.userService.postPhotos(userdata.id,this.photos.length).toPromise().then(photodata => {

            this.createUserForm.reset();

        this.router.navigate(['/user-view/' + userdata.id]);
      });
    }
  },
      err => {
        this.errorvisible = true;
        this.errormessage = err;

       console.log('Error message',err);
      }
    );  
  }
 
 

 
  onFileDropped($event) {
this.detectFiles($event);
  }

 /*
  fileBrowseHandler(images) {
    this.prepareFilesList(images);
  }

 
 
  deleteFile(index: number) {
    if (this.images[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.images.splice(index, 1);
  }

 
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.photos.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.photos[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.photos[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

 
  prepareFilesList(images: Array<any>) {
     for (const item of images) {
      item.progress = 0;
    if (this.images.length <= 2) this.images.push(item);
      console.log('Optælling',this.images);
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
  }

 
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }*/

}
