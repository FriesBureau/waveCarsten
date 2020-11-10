import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../../../services/auth.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
// import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { Dokumenter } from '../../../../model/dokumenter.model';
import Timestamp = firestore.Timestamp;
import { firestore } from 'firebase/app';
import { DecimalPipe} from '@angular/common';
import {  Inject, LOCALE_ID } from '@angular/core';
import {ProgressBarMode} from '@angular/material/progress-bar';



export interface Dokument {
  extension: string;
  location: string;
  modified: Timestamp;
  title: string;
  offline: boolean;
  opened: Timestamp;
  path: string;
  vis: string;
  size: string;
  type: string;
}

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;

  deciPipe: DecimalPipe;

  task: AngularFireUploadTask;
  dokument: Dokument;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;
 
 
 

  constructor(
    private storage: AngularFireStorage, 
    private auth: AuthService,
    private afs: AngularFirestore,
    ) {
   

     }

  ngOnInit(): void  {
    this.startUpload();
  }

  async startUpload() {

    const { uid } = await this.auth.getUser();

    // The storage path
    const path = `dokumenter/${uid}/${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
 
        const fileextension = this.downloadURL.substr(this.downloadURL.lastIndexOf('.') + 1);
        var fileextensionsplittedStr = fileextension.split('?');
        const afkortetfilendelse = fileextensionsplittedStr[fileextensionsplittedStr.length-2];

        const titelendelse = path.split('/');
        const afkortettitel = titelendelse[titelendelse.length-1];

        const data = { 
          createdAt: Timestamp.now(),
          modified: Timestamp.now(),
          extension: afkortetfilendelse,
          title:afkortettitel,
          uid,
          addtoreader: false,

          vis: this.downloadURL, path

        }

        const docRef = await this.afs.collection('dokumenter').add(data);
        const docRefData = docRef.id;

        const iddata = { 
          dokumentid: docRefData
        }

        return this.afs.collection('dokumenter').doc(docRefData).update(iddata);
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
